import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { usePermission } from '../hooks/usePermission';
const UnauthorizedPage = () => {
    const { canDeleteUsers } = usePermission();

if (canDeleteUsers) {
  // نمایش دکمه حذف
}
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1>401 - Unauthorized Access</h1>
            <p>Sorry, you don't have permission to access this page.</p>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={goBack}
                style={{ marginTop: '20px' }}
            >
                Go Back
            </Button>
        </div>
    );
};

export default UnauthorizedPage;