/* -----------------------------------------------
Script      : englishVocsIT.js
Author      : SEisele
Version     : 1.0.0

Description :

Limitations:   
 * Only English <-> German vocabulary

Changelog:
v1.0.0 - Initial release.
----------------------------------------------- */

// Zip Code Vaccination center; Vaccine type
const param = args.widgetParameter;
const paramArray = param ? param.split(";") : [""];
const showMeaning = paramArray[0];
const updateTime = paramArray.length == 1 && Number.isInteger(parseInt(paramArray[1])) && parseInt(paramArray[1]) > 0;

// update timer intervall
const startOfCurrentTime = (time) => (Math.floor(Date.now() / time) * time) + (new Date().getTimezoneOffset()*60*1000)
const oneMinInMillis = (1 * 60 * 1000)
const updateTimeInMillis = (updateTime * oneMinInMillis)
const currentTimeStartInMillis = startOfCurrentTime(updateTimeInMillis)
const currentTime = (Math.floor(new Date().getHours() / updateTime) * updateTime)


const apiData = await getNewCasesData();
const widgetSize = (config.widgetFamily ? config.widgetFamily : 'small');
const widget = await createWidget();

const one = 0;


// For debug delete "!" from !config.runInWidget
if (!config.runInWidget) {
  switch(widgetSize) {
    case 'small': await widget.presentSmall();
    break;
    case 'large': await widget.presentLarge();
    break;
    default: // medium
    await widget.presentMedium();
  }
}

Script.setWidget(widget);
Script.complete();

//------------------------------------------------
// build the content of the widget
async function createWidget() {
  const list = new ListWidget();
  let gradient = new LinearGradient();
  gradient.locations = [0, 0.5];
  gradient.colors = [new Color("141414"), new Color("4974a5")];
  list.backgroundGradient = gradient;

  let row1 = list.addStack();
  row1.layoutHorizontally();
  row1.addSpacer(1);

  let column1 = row1.addStack();
  column1.layoutVertically();

  let column2 = row1.addStack();
  column2.layoutVertically();

  const logoImg = await getImage('flaticon.png');
  const logoStack = column2.addStack();

  if (widgetSize != 'small'){
    logoStack.addSpacer(60);
    list.setPadding(15, 25, 5, 25);
  }else{
    logoStack.addSpacer(14);
    list.setPadding(5, 5, 5, 5);
  }

  const logoImageStack = logoStack.addStack();
  logoStack.layoutHorizontally();
  logoImageStack.backgroundColor = new Color("#ffffff", 1.0);
  logoImageStack.cornerRadius = 6;
  const wimg = logoImageStack.addImage(logoImg);

  if(widgetSize != 'small'){
    wimg.imageSize = new Size(50, 50);
    wimg.rightAlignImage();
  }else{
    wimg.imageSize = new Size(35, 35);
    wimg.rightAlignImage();
  }
  
  
  const paperText = column1.addText("Vocabulary");
  if(widgetSize != 'small'){
    paperText.textColor = Color.white();
    paperText.textOpacity = 0.5;
    paperText.font = Font.mediumRoundedSystemFont(20);
  }else{
    paperText.textColor = Color.white();
    paperText.textOpacity = 0.9;
    paperText.font = Font.mediumRoundedSystemFont(16);
  }
  //list.addSpacer(4)
  
  
    const paperText2 = column1.addText("IT Words");
  if(widgetSize != 'small'){
    paperText2.textColor = Color.white();
    paperText2.textOpacity = 0.5;
    paperText2.font = Font.mediumRoundedSystemFont(20);
  }else{
    paperText2.textColor = Color.white();
    paperText2.textOpacity = 0.9;
    paperText2.font = Font.mediumRoundedSystemFont(16);
  }
  list.addSpacer(4)
 

  if(widgetSize != 'small'){
    list.addSpacer(8);
    const vocEng = list.addText(apiData.vocabulary[0].english);
    vocEng.font = Font.regularSystemFont(20);
    list.addSpacer(2);
    const vocGer = list.addText(apiData.vocabulary[0].german);
    vocGer.font = Font.regularSystemFont(20);
  }else{
    list.addSpacer(4);
    const vocEng = list.addText("E: " + apiData.vocabulary[0].english);
    vocEng.font = Font.regularSystemFont(12);
    list.addSpacer(2);
    const vocGer = list.addText("D: " + apiData.vocabulary[0].german);
    vocGer.font = Font.regularSystemFont(12);
  }
  //list.addSpacer(8);
  
  
  if(widgetSize != 'small'){
    list.addSpacer(8);
    const vocEng = list.addText(apiData.vocabulary[0].meaning);
    vocEng.font = Font.regularSystemFont(20);
  }else{
    list.addSpacer(4);
    const vocEng = list.addText(apiData.vocabulary[0].meaning);
    vocEng.font = Font.regularSystemFont(10);
  }

  
 

  if(widgetSize != 'small'){
    list.addSpacer(8);
    const footer = list.addStack();
    footer.layoutHorizontally();
 
    const footerLeft = footer.addStack();
    footerLeft.backgroundColor = new Color('#a0a0a0', .6);
    footerLeft.cornerRadius = 3;
    footerLeft.setPadding(2, 4, 2, 4);

    const footerWidget = footerLeft.addText('affengriff.net');
    footerWidget.url = 'https://affengriff.net';
    footerWidget.font = Font.mediumSystemFont(8);
    footerWidget.color = new Color('#efefef');

    footer.addSpacer(14);
  }else{
    // nothing at the moment
  }

 return list;
}

//------------------------------------------------
// url get json
async function getNewCasesData(){
  let url = "https://affengriff.net/wp-content/uploads/2021/03/language_IT_Eng.json";
  let req = new Request(url);
  let apiResult = await req.loadJSON();

  return apiResult;
}

//------------------------------------------------
// get images from local filestore or download them once
async function getImage(image){
  let fm = FileManager.local();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir, image);
  
  if (fm.fileExists(path)) {
      return fm.readImage(path);
   }else{
       // download once
       let imageUrl;
       switch (image){
           case 'flaticon.png': imageUrl = "https://image.flaticon.com/icons/png/512/1006/1006772.png";
               break;
           default:
               console.log(`Sorry, couldn't find ${image}.`);
        }
       let iconImage = await loadImage(imageUrl);
       fm.writeImage(path, iconImage);

    return iconImage;
   }
}

//------------------------------------------------
// helper function to download an image from a given url
async function loadImage(imgUrl){
   const req = new Request(imgUrl);

  return await req.loadImage();
}

// end of script copy until here 
