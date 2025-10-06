import { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Link
} from '@mui/material';
import { SignUp } from "./types.ts";

/** Sign-up form for Baby Bootcamp
 *
 * Props: signup function
 * State: formData, fieldErrors, generalError
 *
 * RoutesList -> SignupForm
*/

interface FieldErrors {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  babyName?: string;
}

function SignupForm({ signUp }: SignUp) {
  const navigate = useNavigate();
  const defaultFormData = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    babyName: ""
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>("");

  /** Update formData as user types into form fields */
  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData(currentData => ({ ...currentData, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors(current => ({ ...current, [name]: undefined }));
    }
    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError("");
    }
  }

  /** Send formData to BabyBootcampApp on form submission */
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    try {
      await signUp(formData);
      navigate('/')
    } catch (errors: any) {
      // Try to parse field-specific errors
      const newFieldErrors: FieldErrors = {};
      let hasFieldError = false;

      if (Array.isArray(errors)) {
        errors.forEach((error: string) => {
          const lowerError = error.toLowerCase();
          if (lowerError.includes('username')) {
            newFieldErrors.username = error;
            hasFieldError = true;
          } else if (lowerError.includes('password')) {
            newFieldErrors.password = error;
            hasFieldError = true;
          } else if (lowerError.includes('first name') || lowerError.includes('firstname')) {
            newFieldErrors.firstName = error;
            hasFieldError = true;
          } else if (lowerError.includes('last name') || lowerError.includes('lastname')) {
            newFieldErrors.lastName = error;
            hasFieldError = true;
          } else if (lowerError.includes('email')) {
            newFieldErrors.email = error;
            hasFieldError = true;
          } else if (lowerError.includes('baby')) {
            newFieldErrors.babyName = error;
            hasFieldError = true;
          }
        });

        setFieldErrors(newFieldErrors);

        // If there are errors that don't match specific fields, show as general error
        if (!hasFieldError) {
          setGeneralError(errors.join('. '));
        }
      } else {
        setGeneralError(String(errors));
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                lineHeight: 1.43
              }}
            >
              Log in here
            </Link>
          </Typography>

          {generalError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {generalError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              id="username-input"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username || "1-30 characters"}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="password-input"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || "5-20 characters"}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="first-name-input"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={!!fieldErrors.firstName}
              helperText={fieldErrors.firstName || "1-100 characters"}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="last-name-input"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!fieldErrors.lastName}
              helperText={fieldErrors.lastName || "1-100 characters"}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="baby-name-input"
              name="babyName"
              label="Baby's Name ❤️"
              value={formData.babyName}
              onChange={handleChange}
              error={!!fieldErrors.babyName}
              helperText={fieldErrors.babyName || "2-100 characters"}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="email-input"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email || "Valid email address"}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default SignupForm;