import { firebase } from '../constants/firebase';

export const getInquiriesCategories = async () => {
    // This function gets the list of all existing Complain Categories.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts no params.
    //
    
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();
    
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var categoriesDb = db.collection('Dependencies').doc('HelpDesk').collection('Categories');

    var categories = [];
    var category = {};
    category.categname = '';
    category.categdesc = '';


    // get the document containing the complain categories as fields name
    // from the Dependencies/HDeskComplCat document...
    return categoriesDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docCateg) => {
                categories.push(docCateg.data());

            });

            funcSuccess = 'Ok';
            funcResult = categories;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Categories were found. Returning empty list.';
        }

        var funcReturn = {
            Success: funcSuccess,
            Result: funcResult,
            FailReason: funcFailReason,
            Error: funcError,
            Warning: funcWarning
        };

        // res.send(JSON.stringify(funcReturn));
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
            Warning: funcWarning
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;
    });
};

export const getCompCateg = (categname) => {
    // This function gets the Complain Category document by name.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts one param.
    // 1. Category Names
    //

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();

    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var categoriesDb = db.collection('Dependencies').doc('HelpDesk').collection('Categories');

    // get the document containing the complain categories as fields name
        // from the Dependencies/HDeskComplCat document...
        return categoriesDb.doc(categname).get()
        .then((snapshot) => {
            if(snapshot.exists)
            {
                funcSuccess = 'Ok';
                funcResult = snapshot.data();
                funcFailReason = '';
                funcError = '';

      
            }
            else
            {
                funcSuccess = 'No';
                funcResult = {};
                funcFailReason = 'Requested Category could not be found.';
            }

            var funcReturn = {
                Success: funcSuccess,
                Result: funcResult,
                FailReason: funcFailReason,
                Error: funcError,
                Warning: funcWarning
            };

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
                Warning: funcWarning
            };

            return funcReturn;
        });
};

export const addNewCompCateg = (category) => {
    // This function adds a new Complain Category document.
    // Overwriting existing category document is not allowed.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Category Name
    // 2. Description
    //

    const { categname, categdesc } = category;

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();

    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var newcateg = {
        categName: categname,
        categDescription: categdesc
    }

    var categoriesDb = db.collection('Dependencies').doc('HelpDesk').collection('Categories');
    return categoriesDb.doc(categname).get()
        .then((snapshot) => {
            if(snapshot.exists)
            {
                var funcReturn = {
                    Success: 'No',
                    Result: {},
                    FailReason: 'Category Already Exists.',
                    Error: '',
                    Warning: ''
                };
                
                return funcReturn;
            }
            else {
                return categoriesDb.doc(categname).set(newcateg);
            }
        })
        .then(setresult => {

            var funcReturn = {
                Success: 'Ok',
                Result: {},
                FailReason: '',
                Error: '',
                Warning: ''
            };

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
                Warning: funcWarning
            };

            return funcReturn;
        });
};

export const updateCompCateg = (category) => {
    // This function update existing Complain Category document.
    // Overwriting existing category document is not allowed.
    //
    // A document exists if it has fields. Collections within the document
    // do not mean it exist if it has no fields.
    //
    // The function accepts the following params:
    // 1. Category Name
    // 2. Description
    //

    const { categname, categdesc } = category;

    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";

    var db = firebase.firestore();

    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    var categoriesDb = db.collection('Dependencies').doc('HelpDesk').collection('Categories');
    return categoriesDb.doc(categname).get()
    .then((snapshot) => {
        if(snapshot.exists)
        {
            // It exists... Update the Description...
            return categoriesDb.doc(categname).update({ categDescription: categdesc });

        }
        else {
            // It deos not exist... Return failur message...
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'Category was not found. Update Aborted.';
            funcError = "";

            var funcReturn = {
                Success: funcSuccess,
                Result: funcResult,
                FailReason: funcFailReason,
                Error: funcError,
                Warning: funcWarning
            };

            return funcReturn;
        }
    })
    .then(setresult => {

        var funcReturn = {
            Success: 'Ok',
            Result: {},
            FailReason: '',
            Error: '',
            Warning: ''
        };

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
            Warning: funcWarning
        };

        return funcReturn;
    });

};
