// Example Login function
import apiClient, { saveSession, clearSession } from '@/api.client'; // Adjust path
// Assume you have some state management for user and isAuthenticated

const handleLogin = async (email: string, password: string) => {
  try {
    setIsLoading(true); // Show loading indicator
    const response = await apiClient.post('/auth/login', { email, password });

    if (response.status === 200 && response.data.sessionId) {
      const { user, sessionId } = response.data;

      // 1. Save the session ID securely
      await saveSession(sessionId);

      // 2. Update application state
      setAuthUser(user); // Store user details in state
      setIsAuthenticated(true);

      // 3. Navigate to the main part of the app (handled by navigation logic)

    } else {
      // Handle unexpected success response format
      setErrorMessage('Login failed. Please try again.'); // Show error message
    }
  } catch (error) {
    // Error is likely handled by the interceptor for 401, but catch others
    const message = error.response?.data?.message || 'An error occurred during login.';
    setErrorMessage(message); // Show error message
    setIsAuthenticated(false);
    setAuthUser(null);
  } finally {
    setIsLoading(false); // Hide loading indicator
  }
};

// Example Logout function
const handleLogout = async () => {
  try {
    setIsLoading(true);
    // Call backend logout endpoint (optional but good practice)
    try {
        await apiClient.post('/auth/logout');
    } catch (logoutError) {
        // Log the error, but proceed with client-side logout anyway
        console.warn("Error calling backend logout, proceeding with client cleanup:", logoutError);
    }


    // 1. Clear the stored session ID
    await clearSession();

    // 2. Update application state
    setAuthUser(null);
    setIsAuthenticated(false);

    // 3. Navigate to the login screen (handled by navigation logic)

  } catch (error) {
     // This catch is mainly for errors during clearSession, which are unlikely
    console.error('Error during logout process:', error);
    setErrorMessage('An error occurred during logout.');
    // Still attempt to clear state even if API/storage fails
    setAuthUser(null);
    setIsAuthenticated(false);
  } finally {
    setIsLoading(false);
  }
};