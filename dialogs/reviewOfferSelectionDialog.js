// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ChoicePrompt, ComponentDialog,TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { ReviewRatingDialog, REVIEW_RATING_DIALOG } = require('./reviewRatingDialog');
const REVIEW_OFFER_SELECTION_DIALOG = 'REVIEW_OFFER_SELECTION_DIALOG';
const { InterestReviewSelectionDialog, INTEREST_REVIEW_SELECTION_DIALOG } = require('./reviewInterestSelectionDialog');
const { ReviewDialog, REVIEW_DIALOG } = require('./reviewDialog');
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const axios = require("axios");
const { UserProfile } = require('../userProfile');

class ReviewOfferSelectionDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_OFFER_SELECTION_DIALOG);

        // Define a "done" response for the interest selection prompt.
        this.doneOption = 'No';

        // Define value names for values tracked inside the dialogs.
        this.offer1Selected = 'value-offer1Selected';
        this.offer2Selected = 'value-offer2Selected';
        // Define value names for values tracked inside the dialogs.
        this.reviewOptionSelected = 'value-reviewOptionSelected';

        // Define the company choices for the  selection prompt.
        this.reviewOptions = ['Yes', 'No'];
        // Define the interest choices for the interest selection prompt.
        this.offer1Options = ['Yes', 'No'];
        this.offer2Options = ['Yes', 'No'];

        this.addDialog(new ReviewDialog());
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
         this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ReviewRatingDialog());
          //this.addDialog(new InterestReviewSelectionDialog());
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.promptOffer1SelectionStep.bind(this),
            this.retreiveOfferSelectionStep.bind(this),
            this.continueWithSelectedOffer.bind(this),
              this.promptOffer2SelectionStep.bind(this),
          // this.confirmSelectionStep.bind(this),
             this.retrieveConfirmSelectionStep.bind(this),
            // this.confirmSelectionStep.bind(this),
             this.confirmSelectionStep1.bind(this),
             this.retrieveConfirmSelectionStep1.bind(this),



        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }


    async promptOffer1SelectionStep(stepContext) {

console.log("here prompt")
        // Continue using the same selection list, if any, from the previous iteration of this dialog.
        const list = Array.isArray(stepContext.options) ? stepContext.options : [];
        stepContext.values[this.offer1Selected] = list;
        // Create a prompt message.
        let message = 'Would you be interested in a special bundle for Fiber Optics Broadband Internet + a Samsung Smartphone?';
        const options = this.offer1Options.filter(function(item) { return item !== list[0]; })
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: message,
            retryPrompt: 'Would you be interested in a special bundle for Fiber Optics Broadband Internet + a Samsung Smartphone?',
            choices: options
        });

    }

    async retreiveOfferSelectionStep(stepContext) {

          console.log("here prompt1")
        var list = stepContext.values[this.offer1Selected];

        const choice = stepContext.result;
          console.log("list",choice.value)
        const done = choice.value === this.doneOption;
        if (!done) {
            // If they chose a company, add it to the list.
            list.push(choice.value);
        }

        if (!done && list.length > 0) {
          if(`${ list[0] }` ==   this.offer1Options[1]){
              list =[];
                console.log('here2',choice.value)
               // console.log(`reviewDialog ${ list[0] }`)
              //  await stepContext.context.sendActivity('OK. Is there anything else I can help you with today?');
                 //return await stepContext.next();
                 showMoreOffers = false ;
               //  return await stepContext.next();
              //return await stepContext.beginDialog(REVIEW_RATING_DIALOG);
               //return await stepContext.next();
          }
          if(`${ list[0] }` ==  this.offer1Options[0]){
            showMoreOffers = true;
               list =[];
                 console.log('here3',choice.value)
              //global.repeatSelection = true ;
             // return await stepContext.next();
          }


            list =[];

        }
           return await stepContext.next();

    }


    async continueWithSelectedOffer(stepContext) {
        if(!showMoreOffers){
            console.log('showMoreOffers',showMoreOffers)
            //  endSelection = false;
              //return await stepContext.endDialog();
              await stepContext.context.sendActivity('OK. Is there anything else I can help you with today?');

        }
        console.log('showMoreOffers',showMoreOffers)
      //await stepContext.context.sendActivity('I created a case and our consulant will get back to you today with the offer details.');
             //await stepContext.context.sendActivity('OK. Is there anything else I can help you with today?');
           return await stepContext.next();
  }

    async promptOffer2SelectionStep(stepContext) {
        if(showMoreOffers ){
        // Continue using the same selection list, if any, from the previous iteration of this dialog.
        const list = Array.isArray(stepContext.options) ? stepContext.options : [];
        stepContext.values[this.offer2Selected] = list;
        // Create a prompt message.
        console.log("list top first",list)
        let message = 'Would you be interested in adding Disney to your Fiber Optic Broadband Internet Package?';
        const options = this.offer2Options.filter(function(item) { return item !== list[0]; })
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: message,
            retryPrompt: 'Would you be interested in adding Disney to your Fiber Optic Broadband Internet Package?',
            choices: options
        });
      }else{
          console.log('promptOffer2SelectionStep',"continue")
         return await stepContext.next();
      }
    }








       async confirmSelectionStep(stepContext) {
           if(showMoreOffers ){
        stepContext.values.userInfo = new UserProfile();

        const list = Array.isArray(stepContext.options) ? stepContext.options : [];

        stepContext.values[this.offer2Selected] = list;
         console.log("  stepContext.values[this.offer2Selected]",  stepContext.values[this.offer2Selected])
        let message = '';
        const options = this.offer2Options.filter(function(item) { return item !== list[0]; })
        console.log("confirmSelectionStep")
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: message,
            retryPrompt: 'Please select the topic:',
            choices: options
        });
      }else{
          console.log('promptOffer2SelectionStep',"continue")
         return await stepContext.next();
      }
    }
     async retrieveConfirmSelectionStep(stepContext) {
         if(showMoreOffers){
           showMoreOffers = false ;
           global.notInterested = false ;
       console.log("retrieveConfirmSelectionStep",stepContext.values[this.offer2Selected])
        var list = stepContext.values[this.offer2Selected];
        const choice = stepContext.result;
        const done = choice.value === this.doneOption;
        console.log('retrieveConfirmSelectionStep',choice.value)
        if (!done) {
           console.log('here',choice.value)
            list.push(choice.value);
        }
list.push(choice.value);
        if (list.length > 0) {
              console.log('here1',choice.value)
          const userProfile = stepContext.values.userInfo;
          //userProfile.review= stepContext.result.value || [];
            if(`${ list[0] }` == this.offer2Options[1]){
                list =[];
                  console.log('here2',choice.value)
                 // console.log(`reviewDialog ${ list[0] }`)
                   await stepContext.context.sendActivity('OK. Is there anything else I can help you with today?');
                   return await stepContext.next();

                 //return await stepContext.next();
            }
            if(`${ list[0] }` == this.offer2Options[0]){
                 list =[];
                   console.log('here3',choice.value)
                   var formData = global.formData;



                   if(formData){

                   formData.body.xdmEntity.eventType = "Bot - Interested in Fiber Optic + Disney + Samsung Smartphone Package ";
                   formData.body.xdmEntity['_'+global.tenantID] = {
                                                             "identification":{"core" :{
                                                               "ecid": global.ecid
                                                             }},
                                                             "interactionDetails":{"core":{
                                                            "bot":{
                                                             "botTopic": choice.value
                                                               }
                                                             }
                                                           }
                                                         }

                   formData.body.xdmEntity._id = ""+Date.now();
                   formData.body.xdmEntity.timestamp = ""+new Date().toISOString()

                   //Ingest data in AEP using streaming end point
                   let headers = {
                     "Content-Type": "application/json",
                   }
                   let result = await axios.post(global.streamingEnpointUrl, formData, {
                     headers: headers
                   });
                   //console.log("Interest Selection", formData)
                   let data = result.data;
                  }
                 await stepContext.context.sendActivity('Great! Ive generated the offer package for you. Please see your Meu Vivo account for payment details.');
                 await stepContext.context.sendActivity('OK. Is there anything else I can help you with today?');
                 return await stepContext.next();
            }

        }
      }
      else{
          console.log('retrieveConfirmSelectionStep',"continue")
         return await stepContext.next();
      }
    }



    async confirmSelectionStep1(stepContext) {
     stepContext.values.userInfo = new UserProfile();

     const list = Array.isArray(stepContext.options) ? stepContext.options : [];
     console.log("list here",list)
     stepContext.values[this.reviewOptionSelected] = list;
        console.log("  stepContext.values[this.reviewOptionSelected]",  stepContext.values[this.reviewOptionSelected])
     let message = '';
     const options = this.reviewOptions.filter(function(item) { return item !== list[0]; })
     console.log("confirmSelectionStep")
     return await stepContext.prompt(CHOICE_PROMPT, {
         prompt: message,
         retryPrompt: 'Please select the topic:',
         choices: options
     });

 }
  async retrieveConfirmSelectionStep1(stepContext) {
     console.log("retrieveConfirmSelectionStep1",stepContext.values[this.reviewOptionSelected])
     var reviewList = stepContext.values[this.reviewOptionSelected];
        //console.log('checking',list)
     const choice = stepContext.result;
     const done = choice.value === this.doneOption;
     console.log('retrieveConfirmSelectionStep1 value',choice.value)
     if (!done) {
        console.log('here',choice.value)
         reviewList.push(choice.value);
     }
  console.log('choice.value',choice.value)
     reviewList.push(choice.value);
       console.log('checking1',reviewList)
     if (reviewList.length > 0) {
           console.log('here1',choice.value)
       const userProfile = stepContext.values.userInfo;
       userProfile.review= stepContext.result.value || [];
         if(`${ reviewList[0] }` == this.reviewOptions[1]){
             reviewList =[];
               console.log('here2',choice.value)
              // console.log(`reviewDialog ${ list[0] }`)
             return await stepContext.beginDialog(REVIEW_RATING_DIALOG);
              //return await stepContext.next();
         }
         if(`${ reviewList[0] }` == this.reviewOptions[0]){
              reviewList =[];
                console.log('here3',choice.value)
             global.repeatSelection = true ;
            //  console.log(`reviewDialog ${ list[0] }`)
          /*  if(!loggedInUser){
                 return await stepContext.replaceDialog(INTEREST_REVIEW_SELECTION_DIALOG);
            }else{
               return await stepContext.endDialog();

            }*/
 return await stepContext.endDialog();
             //return await stepContext.replaceDialog(INTEREST_REVIEW_SELECTION_DIALOG);
         }

     }
 }



}

module.exports.ReviewOfferSelectionDialog = ReviewOfferSelectionDialog;
module.exports.REVIEW_OFFER_SELECTION_DIALOG = REVIEW_OFFER_SELECTION_DIALOG;
