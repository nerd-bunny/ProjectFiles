console.log(firebase);

const auth = firebase.auth();
const db = firebase.firestore();
const google = new firebase.auth.GoogleAuthProvider();

const signedIn = document.getElementById("in");
const signInBtn = document.getElementById("inBtn");
const signedOut = document.getElementById("out");
const signOutBtn = document.getElementById("outBtn");
const userID = document.getElementById("uid");
const randomGen = document.getElementById("randomName");
const data = document.getElementById("data");

signInBtn.onclick = () => auth.signInWithPopup(google);
signOutBtn.onclick = () => auth.signOut();

let ref, unsubscribe;

auth.onAuthStateChanged(user => {
    if(user){
        signedIn.hidden = false;
        signedOut.hidden = true;
        userID.innerHTML = "<h4>Hi there, " + user.displayName + "!</h4><h6>Here is your UID: " + user.uid + "</h6>";

        ref = db.collection('names');
        randomGen.onclick = () => {
            ref.add({
                uid: user.uid,
                name: document.getElementById("nameData").value
            });
        }
        unsubscribe = ref.where('uid', '==', user.uid).onSnapshot(querySnapshot => {
            const data2 = querySnapshot.docs.map(doc => {
                return "<li>" + doc.data().name + "</li>";
            });
            data.innerHTML = data2.join('');
        });
    }
    else{
        signedIn.hidden = true;
        signedOut.hidden = false;
        userID.innerHTML = "";

        unsubscribe && unsubscribe();
    }
});