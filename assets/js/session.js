// Load user data and populate UI elements
async function loadUserSession() {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }
    
    try {
      // Get user document from Firestore
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      
      if (!userDoc.exists) {
        console.error('User document not found');
        return;
      }
      
      const userData = userDoc.data();
      
      // Store user data in sessionStorage for easy access
      sessionStorage.setItem('userData', JSON.stringify({
        uid: currentUser.uid,
        nim: userData.nim,
        fullName: userData.fullName,
        programStudi: userData.programStudi,
        role: userData.role,
        profilePicture: userData.profilePicture
      }));
      
      // Update UI with user data
      updateUIWithUserData(userData);
      
      // Check user role and adjust UI accordingly
      handleUserRole(userData.role);
      
    } catch (error) {
      console.error('Error loading user session:', error);
    }
  }
  
  // Update UI elements with user data
  function updateUIWithUserData(userData) {
    // Update profile picture if available
    const profileImages = document.querySelectorAll('.topbar-menu-item-link-profile-image');
    profileImages.forEach(img => {
      if (userData.profilePicture) {
        img.src = userData.profilePicture;
      } else {
        // Set default profile picture
        img.src = 'https://placehold.co/36x36';
      }
    });
    
    // Add user's name to profile dropdown if it exists
    const profileNameElement = document.querySelector('.profile-name');
    if (profileNameElement) {
      profileNameElement.textContent = userData.fullName;
    }
    
    // Add NIM to profile dropdown if it exists
    const profileNimElement = document.querySelector('.profile-nim');
    if (profileNimElement) {
      profileNimElement.textContent = userData.nim;
    }
  }
  
  // Handle user role specific UI adjustments
  function handleUserRole(role) {
    // Add CSS classes based on role
    document.body.classList.add(`role-${role}`);
    
    // Admin and pustakawan get access to management features
    if (role === 'admin' || role === 'pustakawan') {
      // Show admin menu items if they exist
      const adminMenuItems = document.querySelectorAll('.admin-only');
      adminMenuItems.forEach(item => {
        item.style.display = 'block';
      });
    }
    
    // Only admin gets access to user management
    if (role === 'admin') {
      // Show admin-specific menu items
      const superAdminItems = document.querySelectorAll('.super-admin-only');
      superAdminItems.forEach(item => {
        item.style.display = 'block';
      });
    }
  }
  
  // Attach logout function to logout buttons
  function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });
  }
  
  // Initialize session when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      loadUserSession();
      setupLogoutButtons();
    }
  });