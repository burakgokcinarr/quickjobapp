import { View, Text, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, LogBox, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, realDB } from '../../config/FirebaseConfig'
import { ref, set, onValue, query, equalTo, orderByChild, update } from "firebase/database";
import { ref as imageRef, getStorage, getDownloadURL } from "firebase/storage";
import { CustomInput, ImageView } from '../../components'
import DropDownPicker from 'react-native-dropdown-picker';
import CountryPicker from 'react-native-country-picker-modal'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Button, Card, CheckBox } from '@rneui/themed';
import i18n from '../../language/_i18n';
import instance from '../../config/ApiConfig';
import { imagePicker, uploadImageAsync} from '../../utility/Utility';

export default function AddJobs() {

  const [open, setOpen]   = useState(false);
  const [typeOfWorkplaceItems, setTypeOfWorkplaceItems] = useState([
    {label: i18n.t("typeWork_0"), value: '0'},
    {label: i18n.t("typeWork_1"), value: '1'},
    {label: i18n.t("typeWork_2"), value: '2'}
  ]);
  // İş Türü
  const [open2, setOpen2]   = useState(false);
  const [workTypeItems, setWorkTypeItems] = useState([
    {label: i18n.t("workType_0"), value: '0'},
    {label: i18n.t("workType_1"), value: '1'},
    {label: i18n.t("workType_2"), value: '2'},
    {label: i18n.t("workType_3"), value: '3'},
    {label: i18n.t("workType_4"), value: '4'},
    {label: i18n.t("workType_5"), value: '5'},
    {label: i18n.t("workType_6"), value: '6'},
  ]);

  const fileRef                               = imageRef(getStorage(), auth.currentUser.uid);

  const [jobTitle, setJobTitle]               = useState(""); // İş ünvanı (Örn: Satış Görevlisi)
  const [companyName, setCompanyName]         = useState(""); // Şirket Adı
  const [typeOfWorkplace, setTypeOfWorkplace] = useState(0);    // İş yeri türü
  const [workType, setWorkType]               = useState(0);    // İş Türü
  const [description, setDescription]         = useState(""); // Açıklama
  const [email, setEmail]                     = useState(""); // E-Posta
  const [phone, setPhone]                     = useState(""); // Telefon No
  const [locationName, setLocationName]       = useState(''); // Konum Bilgisi
  const [checkPhone, setCheckPhone]           = useState(false); // Telefon ile ulaşma izni verilsin mi ?
  const [lat, setLat]                         = useState(""); // Country Lat
  const [long, setLong]                       = useState(""); // Country Long
  const [firmImageUri, setFirmImageUri]       = useState(null); // Firm Image Uri
  const [selectImage, setSelectImage]         = useState(null); // Select Firm Image Uri
  const [urgent, setUrgent]                   = useState(false); // İlan Acil mi ?

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])

  useEffect(() => {
    // Firma tarafından yüklenen resmi(varsa) önceden yükleme
    const loadFirmImage = async() => {
      let image = await getDownloadURL(fileRef);
      if (image) {
        setFirmImageUri(image);
        setSelectImage(image);
      }
    }

    loadFirmImage();
  }, [])

  function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  const getCountryLatLong = async(country) => {
    // Seçilen ülke adı
    setLocationName(country.name);

    instance.get('/v1/forward', {
      params: {
        query: country.name,
        country: country.cca2
      }
    }).then(({ data }) => {
      //console.log(data)
      if (data.data[0].country_module != undefined) {
        setLat(data.data[0].country_module.latitude);
        setLong(data.data[0].country_module.longitude);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const writeJobData = () => {
    const userId    = auth.currentUser.uid;
    const randomUUD = generateUUID();

    if (jobTitle == "" || companyName == "" || description == "" || email == "" || locationName == "") {
      Alert.alert(i18n.t("warning"), i18n.t("account_info"));
      return
    }

    if (checkPhone && phone == "") {
      Alert.alert(i18n.t("warning"), i18n.t("account_info"));
      return
    }

    if (userId && randomUUD) {
      const time = Date.now();
      //console.log(time)
      set(ref(realDB, 'jobs/' + randomUUD), {
        jobTitle: jobTitle,
        companyName: companyName,
        typeOfWorkplace : typeOfWorkplace,
        workType: workType,
        description: description,
        email: email,
        phone: phone,
        locationName: locationName,
        userId: userId,
        createTime: time,
        givePhone: checkPhone,
        lat: lat,
        long: long,
        firmImage: firmImageUri,
        urgent: urgent
      }).then(() => {
        setJobTitle("");
        setCompanyName("");
        setTypeOfWorkplace(0);
        setWorkType(0);
        setDescription("");
        setEmail("");
        setPhone("");
        setLocationName("");
        setLat("");
        setLong("");
        setCheckPhone(false);
        setUrgent(false);

        Alert.alert(i18n.t("success"), i18n.t("job_publish_message"));
      })
    } else {
      console.log("Kullanıcı hesap bilgilerine/yetkisine ulaşılamadı..!");
    }
  }

  const imagePickerOpen = async() => {
    let imageUri = await imagePicker();
    //console.log("SECİLEN IMAGE = ", imageUri)
    if (imageUri) {
      setSelectImage(imageUri);
      await uploadImageAsync(imageUri, auth.currentUser.uid).then(async() => {
        let image = await getDownloadURL(fileRef);
        if (image) {
          setFirmImageUri(image);
        }
      })
    }
  }

  return (
    <KeyboardAvoidingView style={style.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS == 'android' ? 100 : 100}>
      <ScrollView style={style.container}>
        <View style={style.form}>
          <Card>
            <Card.Title>{i18n.t('firm_upload_logo')}</Card.Title>
            <Card.Title style={{color: 'brown', textAlign: 'center', fontSize: 11}}>{i18n.t("firm_logo_info")}</Card.Title>
            <ImageView imageUri={selectImage} width={100} height={100} onPress={imagePickerOpen} imageViewType={'avatar'}/>
          </Card>
          <CheckBox
            center
            title={i18n.t('urgent_title')}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={urgent}
            containerStyle={{backgroundColor: 'transparent'}}
            onPress={() => setUrgent(!urgent)}
          />
          <Card>
            <Card.Title>{i18n.t("job_title")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
            <CustomInput value={jobTitle} isRequired={true} inputTitle={""} placeholderText={i18n.t("job_title_desc")} onChangeText={setJobTitle} errorMessage={""}/>
          </Card>
          <Card>
            <Card.Title>{i18n.t("company_name")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
            <CustomInput value={companyName} isRequired={true} inputTitle={""} placeholderText={i18n.t("company_name")} onChangeText={setCompanyName} errorMessage={""}/>
          </Card>
          <Card>
            <Card.Title>{i18n.t("type_work")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
            <DropDownPicker
              open={open}
              value={typeOfWorkplace}
              items={typeOfWorkplaceItems}
              setOpen={setOpen}
              setValue={setTypeOfWorkplace}
              setItems={setTypeOfWorkplaceItems}
              multiple={false}
              mode="BADGE"
              searchable={false}
              placeholder={i18n.t("type_work_desc")}
              dropDownDirection="TOP"
              style={{marginBottom: 5, borderColor: '#047bb4'}}
              //badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            />
          </Card>
          <Card>
            <Card.Title>{i18n.t("location_name")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
              <View style={{borderWidth:1, borderColor: '#047bb4', height: 40, justifyContent: 'center'}}>
              <CountryPicker 
                withModal
                withFilter
                placeholder={locationName == "" ? i18n.t("location_name_desc") : locationName}
                //visible={true}
                onSelect={(country) => getCountryLatLong(country)}
                containerButtonStyle={{paddingHorizontal: 7}}
              />
              </View>
          </Card>
          <Card>
            <Card.Title>{i18n.t("work_type")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
              <DropDownPicker
                open={open2}
                value={workType}
                items={workTypeItems}
                setOpen={setOpen2}
                setValue={setWorkType}
                setItems={setWorkTypeItems}
                multiple={false}
                mode="BADGE"
                searchable={false}
                placeholder={i18n.t("work_type_desc")}
                dropDownDirection="TOP"
                style={{marginBottom: 5, borderColor: '#047bb4'}}
                //badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
              />
          </Card>
          <Card>
            <Card.Title>{i18n.t("description")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
              <View style={style.textAreaContainer} >
              <TextInput
                style={style.textArea}
                underlineColorAndroid="transparent"
                placeholder={i18n.t("description_desc")}
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={setDescription}
                value={description}
              />
              </View>
          </Card>
          <Card>
            <Card.Title>{i18n.t("email")} (<FontAwesome5 name="star-of-life" size={10} color="red" />)</Card.Title>
            <CustomInput value={email} keyboardType='email-address' isRequired={true} inputTitle={""} placeholderText={i18n.t("email_desc")} onChangeText={setEmail} errorMessage={""}/>
          </Card>
          <Card>
            <CheckBox
              center
              title={i18n.t("check_phone")}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={checkPhone}
              onPress={() => setCheckPhone(!checkPhone)}
            />
            <CustomInput disabled={!checkPhone} value={phone} keyboardType='phone-pad' isRequired={false} inputTitle={""} placeholderText={i18n.t("phone")} onChangeText={setPhone} errorMessage={""}/>
          </Card>
        </View>
      </ScrollView>
      <Button
              title={i18n.t("job_publish_btn")}
              icon={{
                name: 'publish',
                type: 'material',
                size: 20,
                color: 'white',
              }}
              buttonStyle={{
                backgroundColor: '#235284',
                borderRadius: 3,
              }}
              containerStyle={{
                //width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
                marginBottom: 20,
              }}
              onPress={writeJobData}
            />
    </KeyboardAvoidingView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  form: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  textAreaContainer: {
    borderColor: '#047bb4',
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  }
})