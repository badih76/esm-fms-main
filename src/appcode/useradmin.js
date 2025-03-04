import { firebase } from '../constants/firebase';

Number.prototype.pad = function (size, c) {
    var s = String(this);
    while (s.length < (size || 2)) { s = c + s; }
    return s;
}

export const getUserGroups = async () => {
    // This function gets the list of all existing User Groups Names.
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
    
    // const settings = { timestampsInSnapshots: true };
    // db.settings(settings);

    var usersDb = db.collection('Users').doc('docUserGroups').collection('colUserGroups');

    var userGroups = [];
    var Name = "";

    // get all documents in the user groups collection...
    return usersDb.get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docUG) => {
                Name = docUG.data().Name;
                userGroups.push({Name: Name});

            });

            funcSuccess = 'Ok';
            funcResult = userGroups;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No User Groups were found. Returning empty list.';
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

export const getUserGroup = async (ugName) => {
    // This function gets the document of the given User Group Name.
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
    
    // const settings = { timestampsInSnapshots: true };
    // db.settings(settings);

    var usersDb = db.collection('Users').doc('docUserGroups').collection('colUserGroups');

    var userGroup = {};

    // get all documents in the user groups collection...
    return usersDb.where("Name", "==", ugName).get()
    .then((snapshot) => {

        if (snapshot.docs.length > 0)
        {
            userGroup = {...snapshot.docs[0].data()};

            funcSuccess = 'Ok';
            funcResult = userGroup;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No User Group found. Returning empty list.';
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

export const getUsers = async (userGroupName) => {
    // This function gets the list of all existing User Groups Names.
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
    
    // const settings = { timestampsInSnapshots: true };
    // db.settings(settings);

    var usersDb = db.collection('Users').doc('docUsers').collection('colUsers');

    var users = [];
    var displayName = "";

    // get all documents in the user groups collection...
    return usersDb.where("UserGroup", "==", userGroupName).get()
    .then((snapshot) => {
        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docUser) => {
                displayName = docUser.data().displayName;
                users.push({displayName: displayName});

            });

            funcSuccess = 'Ok';
            funcResult = users;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Users were found. Returning empty list.';
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

export const getUser = async (userName) => {
    // This function gets the document of existing User Name.
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
    
    // const settings = { timestampsInSnapshots: true };
    // db.settings(settings);

    var usersDb = db.collection('Users').doc('docUsers').collection('colUsers');

    var user = {};
    
    return usersDb.where("displayName", "==", userName).get()
    .then((snapshot) => {
        if (snapshot.docs.length > 0)
        {
            user = {...snapshot.docs[0].data()};
            funcSuccess = 'Ok';
            funcResult = user;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = {};
            funcFailReason = 'No User was found. Returning empty list.';
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

export const addUserGroup = async (userGroup) => {
    // This function adds a new User Group document.
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
    
    // const settings = { timestampsInSnapshots: true };
    // db.settings(settings);

    var usersDb = db.collection('Users').doc('docUserGroups').collection('colUserGroups');

    // get all documents in the user groups collection...
    return usersDb.where("UserGroup", "==", userGroup.Name).get()
    .then((snapshot) => {
        if (snapshot.docs.length > 0)
        {
            // the userGroup Exists... Stop the add process...
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'User Group Exists. Adding Aborted.';   

            var funcReturn = {
                Success: funcSuccess,
                Result: funcResult,
                FailReason: funcFailReason,
                Error: funcError,
                Warning: funcWarning
            };
    
            // res.send(JSON.stringify(funcReturn));
            return funcReturn;
             
        }
        else
        {
            // It doesn't exist... Add it...
            return usersDb.doc(userGroup.Name).set(userGroup);
        }

    })
    .then(result => {
        var funcReturn = {
            Success: "Ok",
            Result: result,
            FailReason: "",
            Error: "",
            Warning: ""
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

export const editUserGroup = async (userGroup) => {
    // This function edits a existing User Group document.
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
    
    var usersDb = db.collection('Users').doc('docUserGroups').collection('colUserGroups');

    // get all documents in the user groups collection...
    return usersDb.where("Name", "==", userGroup.Name).get()
    .then((snapshot) => {
        if (snapshot.docs.length > 0)
        {
            console.log("Doc Found")
            // It exists... Update it...
            return usersDb.doc(userGroup.Name).set(userGroup);             
        }
        else
        {
            console.log("Doc Not Found");
            // the userGroup does not Exist... Stop the add process...
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'User Group Does Not Exist. Updating Aborted.';   

            var funcReturn = {
                Success: funcSuccess,
                Result: funcResult,
                FailReason: funcFailReason,
                Error: funcError,
                Warning: funcWarning
            };
    
            // res.send(JSON.stringify(funcReturn));
            return funcReturn;
            
        }

    })
    .then(result => {
        var funcReturn = {
            Success: "Ok",
            Result: result,
            FailReason: "",
            Error: "",
            Warning: ""
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


export const addUser = async (user) => {
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";
    
    var currentUser = firebase.auth().currentUser;
    var db = firebase.firestore();
    var currUserPw = "";

    db.collection("Users").doc("docUsers").collection("colUsers")
        .where("UID", "==", currentUser.uid).get()
        .then(snapshot => {
            if(snapshot.docs.length > 0)
            {
                currUserPw = snapshot.docs[0].data().password;
            }
        })
        .catch(error => {
            console.log(error);
        });

    // signup the new user with Firebase...
    firebase.auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(result => {
        // get the UID of the new user 
        // and add user profile to the database...
        user.UID = result.user.uid;
        user.email = user.email.toLowerCase();
        return db.collection('Users')
            .doc('docUsers').collection('colUsers')
            .doc(user.displayName).set(user);

    })
    .then(result => {
        // update user profile... 

        // signout the current user...
        firebase.auth().signOut();
        
        // signin new user
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(result => {
            result.user.updateProfile({
                displayName: user.displayName,
                phoneNumber: user.phoneNumber
            });
        })
        .then(result => {
            // logout the new user and login the old user...
            firebase.auth().signOut();
            firebase.auth().signInWithEmailAndPassword(currentUser.email, currUserPw);
        })
        .catch(error => {
            console.log(error);
        });

    })
    .then(result => {
        var funcReturn = {
            Success: "Ok",
            Result: user,
            FailReason: "",
            Error: "",
            Warning: ""
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;
    })
    .catch(function(error) {
        console.log(error);
        var funcReturn = {
            Success: "No",
            Result: null,
            FailReason: "Error",
            Error: error,
            Warning: ""
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;

    });  
};

export const editUser = async (user, oldPw = '') => {
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";
    
    var currentUser = firebase.auth().currentUser;
    var db = firebase.firestore();
    var currUserPw = "";

    db.collection("Users").doc("docUsers").collection("colUsers")
        .where("UID", "==", currentUser.uid).get()
        .then(snapshot => {
            if(snapshot.docs.length > 0)
            {
                currUserPw = snapshot.docs[0].data().password;
            }
        })
        .catch(error => {
            console.log(error);
        });


    // signup the new user with Firebase...
    db.collection('Users').doc('docUsers').collection('colUsers')
    .doc(user.displayName).get()
    .then(snapshot => {
        if(snapshot.exists)
        {
            return db.collection('Users')
                .doc('docUsers').collection('colUsers')
                .doc(user.displayName).update(user);
        }
    })
    .then(result => {
        // update user profile... 

        // signout the current user...
        firebase.auth().signOut();
        
        // signin new user
        firebase.auth().signInWithEmailAndPassword(user.email, oldPw)
        .then(result => {
            result.user.updateProfile({
                displayName: user.displayName,
                phoneNumber: user.phoneNumber
            })
            .catch(error => {
                console.log("Error: ", error);
            });


            result.user.updatePassword(user.password)
            .catch(error => {
                console.log("Error: ", error);
            });
        })
        .then(result => {
            // logout the new user and login the old user...
            firebase.auth().signOut();
            firebase.auth().signInWithEmailAndPassword(currentUser.email, currUserPw);
        })
        .catch(error => {
            console.log(error);
        });

    })
    .then(result => {
        var funcReturn = {
            Success: "Ok",
            Result: user,
            FailReason: "",
            Error: "",
            Warning: ""
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;
    })
    .catch(function(error) {
        console.log(error);
        var funcReturn = {
            Success: "No",
            Result: null,
            FailReason: "Error",
            Error: error,
            Warning: ""
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;

    });
};

export const getUGPrivil = (ug) => {
    var db = firebase.firestore();

    return db.collection("Users").doc("docUserGroups").collection("colUserGroups")
        .where("Name", "==", ug).get()
        .then(snapshot => {
            if(snapshot.docs.length > 0)
            {
                return  snapshot.docs[0].data().Privileges;
            }
        })
        .catch(error => {
            console.log(error);
        });
        
};

export const getClientUsers = async () => {
    // This function gets the list of all existing Client Users Names.
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
    
    // const settings = { timestampsInSnapshots: true };
    // db.settings(settings);

    var usersDb = db.collection('Users').doc('docClientUsers').collection('Users');

    var users = [];
    var userEmail = "";

    // get all documents in the user groups collection...
    return usersDb.get()
    .then((snapshot) => {
        if (snapshot.docs.length > 0)
        {
            snapshot.forEach((docUser) => {
                userEmail = docUser.data().userEmail;
                users.push(docUser.data());

            });

            funcSuccess = 'Ok';
            funcResult = users;
            
        }
        else
        {
            funcSuccess = 'No';
            funcResult = [];
            funcFailReason = 'No Users were found. Returning empty list.';
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

export const addClientUser = async (user) => {
    var funcSuccess = "";
    var funcResult = "";
    var funcError = "";
    var funcWarning = "";
    var funcFailReason = "";
    
    var currentUser = firebase.auth().currentUser;
    var db = firebase.firestore();
    var currUserPw = "";

    // db.collection("Users").doc("docClientUsers").collection("Users")
    //     .where("UID", "==", currentUser.uid).get()
    //     .then(snapshot => {
    //         if(snapshot.docs.length > 0)
    //         {
    //             currUserPw = snapshot.docs[0].data().password;
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });

    console.log("User: ", user);
    // signup the new user with Firebase...
    firebase.auth()
    .createUserWithEmailAndPassword(user.userEmail, user.passWord)
    .then(result => {
        // get the UID of the new user 
        // and add user profile to the database...
        let UID = result.user.uid;
        user.userEmail = user.userEmail.toLowerCase();
        return db.collection('Users')
            .doc('docClientUsers').collection('Users')
            .doc(UID).set(user);

    })
    .then(result => {
        var funcReturn = {
            Success: "Ok",
            Result: user,
            FailReason: "",
            Error: "",
            Warning: ""
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;
    })
    .catch(function(error) {
        console.log(error);
        var funcReturn = {
            Success: "No",
            Result: null,
            FailReason: "Error",
            Error: error,
            Warning: ""
        };

        // res.send(JSON.stringify(funcReturn));
        return funcReturn;

    });  
};