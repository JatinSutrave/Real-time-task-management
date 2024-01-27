const db = firebase.firestore();

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User registered:', userCredential.user);
        })
        .catch((error) => {
            console.error('Registration error:', error);
        });
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user);
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('task-section').style.display = 'block';
            loadTasks();
        })
        .catch((error) => {
            console.error('Login error:', error);
        });
}

function resetPassword() {
    const email = document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            console.log('Password reset email sent');
        })
        .catch((error) => {
            console.error('Password reset error:', error);
        });
}

function createTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('due-date').value;
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
        db.collection('tasks').add({
            title: title,
            description: description,
            dueDate: dueDate,
            createdBy: currentUser.uid,
            createdAt: new Date()
        })
        .then(() => {
            console.log('Task created successfully');
            loadTasks();
        })
        .catch((error) => {
            console.error('Error creating task:', error);
        });
    } else {
        console.error('No user logged in');
    }
}

function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
        db.collection('tasks').where('createdBy', '==', currentUser.uid).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const taskData = doc.data();
                    const li = document.createElement('li');
                    li.textContent = `${taskData.title} - ${taskData.description} - Due: ${taskData.dueDate}`;
                    taskList.appendChild(li);
                });
            })
            .catch((error) => {
                console.error('Error loading tasks:', error);
            });
    } else {
        console.error('No user logged in');
    }
}
