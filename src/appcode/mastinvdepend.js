import { firebase } from '../constants/firebase';

var db = firebase.firestore();
  
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// ---------------------------------------------------------------------------------------

export const addNewInvCategory = (category) => {
    // This function creates a new Equipment Category document,
    // or reset the existing one.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Category's Name
    // 2. Description
    // 6. Over-write if exists flag (Y/N)

    try {
        var ow = 'N';
  
        var funcSuccess = "";
        var funcResult = "";
        var funcError = "";
        var funcWarning = "";
        var funcFailReason = "";
  
        var categoriesDb = db.collection('Inventory').doc('Dependencies').collection('Categories');
  
      }
      catch(err)
      {
        console.log(err);
      }
  
      // check if a document exists for the mentioned category name...
      return categoriesDb.doc(category.Name).get()
        .then((snapshot) => {
          if(snapshot.exists) {
            // The category document exists...
            if(ow.toUpperCase() == 'Y') {
              // Yes, overwrite existsing client document...
              
              return categoriesDb.doc(category.Name).set(category);
            }
            else {
              // Do not overwrite... Return the results...
              funcSuccess = 'No';
              funcResult = {};
              funcFailReason = 'Category already exists. No Overwrite.';
  
              var funcReturn = {
                Success: funcSuccess,
                Result: funcResult,
                FailReason: funcFailReason,
                Error: funcError,
                Warning: funcWarning };
  
                return funcReturn;
            }
          }
          else {
            // No document exists for this category... Create a new document...
            return categoriesDb.doc(category.Name).set(category);
          }
        })
        .then((result) => {
          // On successful writing of category document to database...
          funcSuccess = 'Ok';
          funcResult = {};
  
          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };
  
            return funcReturn;
  
        })
        .catch((err) => {
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Error';
          funcError = err.message;
  
          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };
  
            return funcReturn;
        });
}

export const updateInvCategory = (category) => {
    // This function updates an existsing category document.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Client's Name
    // 2. Description
    //

    var cn = category.Name;
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var categoriesDb = db.collection('Inventory').doc('Dependencies').collection('Categories');

    // check if a document exists for the mentioned category name...
    return categoriesDb.doc(cn).get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The client document exists. Update category document...
          return categoriesDb.doc(cn).update(category);
        }
        else {
          // No document exists for this category... Return result...
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Category do not exist.'

          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

          return funcReturn;
        }
      })
      .then((result) => {
        // On successful writing of category document to database...
        funcSuccess = 'Ok';
        funcResult = {};

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      })
      .catch((err) => {
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Error';
        funcError = err.message;

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      });
};

export const getCategoryByName = (cName) => {
    // This function gets an existsing Category document.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Category's Name
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var categoriesDb = db.collection('Inventory').doc('Dependencies').collection('Categories');

    // check if a document exists for the mentioned category name...
    return categoriesDb.doc(cName).get()
      .then((snapshot) => {
        if(snapshot.exists) {
          // The category document exists. Return the category document...

          funcSuccess = 'Ok';
          funcResult = snapshot.data();

          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

          return funcReturn;
        }
        else {
          // No document exists for this category... Return result...
          funcSuccess = 'No';
          funcResult = {};
          funcFailReason = 'Category do not exist.'

          var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning };

          return funcReturn;
        }
      })
      .catch((err) => {
        funcSuccess = 'No';
        funcResult = {};
        funcFailReason = 'Error';
        funcError = err.message;

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      });
};

export const getCategList = () => {
    // This function gets the list fo Categories names of all existing categories.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts no params:
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var categoriesDb = db.collection('Inventory').doc('Dependencies').collection('Categories');

    // check if a document exists...
    return categoriesDb.get()
      .then((snapshot) => {
        // go through the snapshot docs and get the categories names and push
        // them into a JSON string...

        if(snapshot.docs.length == 0)
        { // There are no docs in the clients snapshot...
          funcSuccess = 'No';
          funcResult = [];
          funcFailReason = 'There are no categories found. Returning Empty List.';

        }
        else {
          let categories = [];
          snapshot.forEach((docCateg) => {
                categories.push(docCateg.data());            
            });
          
          funcSuccess = 'Ok';
          funcResult = categories;

        }

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      })
      .catch((err) => {
        funcSuccess = 'No';
        funcResult = [];
        funcFailReason = 'Error';
        funcError = err.message;

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      });
};

// ---------------------------------------------------------------------------------------

export const addEquipmentTemplate = (equipTemp) => {
  // This function creates a new Equipment document.
  // This function will not reset any existing document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts the following params:
  // 1. EquipName
  // 2. SerialNumber
  // 3. PurchaseValue
  // 4. PurchaseDate
  // 5. Description
  // 6. Category1
  // 7. Category2
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory').doc('Dependencies')
    .collection('EquipTemplates');


  // check if a document exists for the mentioned category name...
  return inventoryDb.doc(equipTemp.Name).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists...
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Equipment Template already exists. No Overwrite.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // No document exists for this category... Create a new document...
        return inventoryDb.doc(equipTemp.Name).set(equipTemp);
      }
    })
    .then((result) => {
      // On successful writing of category document to database...
      funcSuccess = 'Ok';
      funcResult = '{}';

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;

    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = '{}';
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

export const updateEquipTemplate = (equipTemp) => {
  // This function updates an existsing Equipment document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts the following params:
  // 1. EquipName
  // 2. SerialNumber
  // 3. PurchaseValue
  // 4. PurchaseDate
  // 5. Description
  // 6. Category1
  // 7. Category2
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory')
                      .doc('Dependencies')
                      .collection('EquipTemplates');


  // check if a document exists for the mentioned equipment name...
  return inventoryDb.doc(equipTemp.Name).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists. Update equipment document...
        return inventoryDb.doc(equipTemp.Name).update(equipTemp);
      }
      else {
        // No document exists for this category... Return result...
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Equipment do not exist.'

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
    })
    .then((result) => {
      // On successful writing of category document to database...
      funcSuccess = 'Ok';
      funcResult = '{}';

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;

    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = '{}';
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

export const getEquipTemplate = (equipTempName) => {
  // This function gets an existsing Equipment document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts the following params:
  // 1. Equipment's Name
  //

  var en = equipTempName;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory').doc('Dependencies')
    .collection('EquipTemplates');

  // check if a document exists for the mentioned equipment name...
  return inventoryDb.doc(en).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists. Return the equipment document...

        funcSuccess = 'Ok';
        funcResult = snapshot.data();

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
      else {
        // No document exists for this category... Return result...
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Equipment do not exist.'

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = '{}';
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
}

export const getEquipTemplatesList = () => {
  // This function gets the list all existing categories.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts no params:
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory').doc('Dependencies')
    .collection('EquipTemplates');

  // check if a document exists...
  return inventoryDb.get()
    .then((snapshot) => {
      // go through the snapshot docs and get the equipments names and push
      // them into a JSON string...

      if(snapshot.docs.length == 0)
      { // There are no docs in the clients snapshot...
        funcSuccess = 'No';
        funcResult = [];
        funcFailReason = 'There are no Equipments found. Returning Empty List.';

      }
      else {
        let result = [];

        snapshot.forEach((docEquip) => {
          
          result.push(docEquip.data());
        });

        funcSuccess = 'Ok';
        funcResult = result;

      }

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;

    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = [];
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

// ---------------------------------------------------------------------------------------

export const addSPTemplate = (spTemp) => {
  // This function creates a new spare part document.
  // This function will not reset any existing document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts the following params:
  // 1. SparePartName
  // 2. UPCNumber
  // 3. Quantity
  // 4. Category1
  // 5. Category2
  // 6. Description
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory').doc('Dependencies')
    .collection('SPTemplates');

  // check if a document exists for the mentioned Spare Part name...
  return inventoryDb.doc(spTemp.Name).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists...
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Spare Part already exists. No Overwrite.';

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;

      }
      else {
        // No document exists for this category... Create a new document...
        return inventoryDb.doc(spTemp.Name).set(spTemp);
      }
    })
    .then((result) => {
      // On successful writing of category document to database...
      funcSuccess = 'Ok';
      funcResult = '{}';

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;

    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = '{}';
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
}

export const updateSPTemplate = (spTemp) => {
  // This function updates an existsing Spare Part document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts the following params:
  // 1. SparePartName
  // 2. UPCNumber
  // 3. Quantity
  // 4. Category1
  // 5. Category2
  // 6. Description
  //
  // Collection -> Transactions (Receive, Issue, Maintain)
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory').doc('Dependencies')
    .collection('SPTemplates');

  // check if a document exists for the mentioned Spare Part name...
  return inventoryDb.doc(spTemp.Name).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists. Update equipment document...
        return inventoryDb.doc(spTemp.Name).update(spTemp);
      }
      else {
        // No document exists for this spare part... Return result...
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Spare Part do not exist.'

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
    })
    .then((result) => {
      // On successful writing of category document to database...
      funcSuccess = 'Ok';
      funcResult = '{}';

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;

    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = '{}';
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

export const getSPTemplate = (spTempName) => {
  // This function gets an existsing Spare Part document.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts the following params:
  // 1. Spare Part's Name
  //

  var en = spTempName;

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory')
                      .doc('Dependencies')
                      .collection('SPTemplates');

  // check if a document exists for the mentioned spare part name...
  return inventoryDb.doc(en).get()
    .then((snapshot) => {
      if(snapshot.exists) {
        // The document exists. Return the spare part document...

        funcSuccess = 'Ok';
        funcResult = snapshot.data();

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
      else {
        // No document exists for this category... Return result...
        funcSuccess = 'No';
        funcResult = '{}';
        funcFailReason = 'Spare Part do not exist.'

        var funcReturn = {
          Success: funcSuccess,
          Result: funcResult,
          FailReason: funcFailReason,
          Error: funcError,
          Warning: funcWarning };

        return funcReturn;
      }
    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = '{}';
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

export const getSPTemplatesList = () => {
  // This function gets the list all existing Spare Part.
  //
  // A document exists if it has fields. Collections within the document
  // do not mean it exist if it has no fields.
  //
  // The function accepts no params:
  //

  var funcSuccess = "";
  var funcResult = "";
  var funcError = "";
  var funcWarning = "";
  var funcFailReason = "";

  var inventoryDb = db.collection('Inventory')
                      .doc('Dependencies')
                      .collection('SPTemplates');

  // check if a document exists...
  return inventoryDb.get()
    .then((snapshot) => {
      // go through the snapshot docs and get the spare part names and push
      // them into a JSON string...

      if(snapshot.docs.length == 0)
      { // There are no docs in the clients snapshot...
        funcSuccess = 'No';
        funcResult = [];
        funcFailReason = 'There are no Spare Parts found. Returning Empty List.';

      }
      else {
        let result = [];
        snapshot.forEach((docEquip) => {
          result.push(docEquip.data());
        });

        funcSuccess = 'Ok';
        funcResult = result;

      }

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;

    })
    .catch((err) => {
      funcSuccess = 'No';
      funcResult = [];
      funcFailReason = 'Error';
      funcError = err.message;

      var funcReturn = {
        Success: funcSuccess,
        Result: funcResult,
        FailReason: funcFailReason,
        Error: funcError,
        Warning: funcWarning };

      return funcReturn;
    });
};

// ---------------------------------------------------------------------------------------

