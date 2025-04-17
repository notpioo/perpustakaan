// Display error message
function showError(message, formId) {
    const form = document.getElementById(formId);
    
    // Remove existing alerts
    const existingAlert = form.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.textContent = message;
    
    // Insert at the top of form
    form.insertBefore(alert, form.firstChild);
  }
  
  // Display success message
  function showSuccess(message, formId) {
    const form = document.getElementById(formId);
    
    // Remove existing alerts
    const existingAlert = form.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = message;
    
    // Insert at the top of form
    form.insertBefore(alert, form.firstChild);
  }
  
  // Initialize login functionality
  function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nim = document.getElementById('nim').value;
      const password = document.getElementById('password').value;
      
      try {
        // Check if NIM exists in database
        const userQuery = await db.collection('users').where('nim', '==', nim).get();
        
        if (userQuery.empty) {
          showError('NIM tidak ditemukan', 'loginForm');
          return;
        }
        
        // Get user email
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        const userEmail = userData.email;
        
        // Sign in with Firebase Auth
        await auth.signInWithEmailAndPassword(userEmail, password);
        
        // Redirect handled by onAuthStateChanged
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.code === 'auth/wrong-password') {
          showError('Password salah', 'loginForm');
        } else if (error.code === 'auth/user-not-found') {
          showError('Akun tidak ditemukan', 'loginForm');
        } else {
          showError('Terjadi kesalahan: ' + error.message, 'loginForm');
        }
      }
    });
  }
  
  // Initialize registration functionality
  function initializeRegistration() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nim = document.getElementById('nim').value;
      const fullName = document.getElementById('fullName').value;
      const programStudi = document.getElementById('programStudi').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        showError('Password tidak cocok', 'registerForm');
        return;
      }
      
      try {
        // Check if NIM already exists
        const nimQuery = await db.collection('users').where('nim', '==', nim).get();
        if (!nimQuery.empty) {
          showError('NIM sudah terdaftar', 'registerForm');
          return;
        }
        
        // Create email from NIM
        const email = `${nim}@perpustakaan.ac.id`;
        
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Add user data to Firestore
        await db.collection('users').doc(user.uid).set({
          nim: nim,
          fullName: fullName,
          programStudi: programStudi,
          email: email,
          role: 'anggota', // Default role
          profilePicture: null, // Default profile picture
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showSuccess('Pendaftaran berhasil! Mengalihkan ke halaman login...', 'registerForm');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
        
      } catch (error) {
        console.error('Registration error:', error);
        showError('Terjadi kesalahan: ' + error.message, 'registerForm');
      }
    });
  }
  
  // Logout functionality
  function logout() {
    auth.signOut()
      .then(() => {
        window.location.href = '/pages/auth/login.html';
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }