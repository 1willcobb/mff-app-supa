import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/utils/authContext';

const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation happens automatically via the auth context
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleLogout}
    >
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LogoutButton;