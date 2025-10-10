const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * POST /api/auth/get-token
 * Get Salesforce access token using OAuth2 password flow
 */
router.post("/get-token", async (req, res) => {
  try {
    const loginUrl = process.env.SF_LOGIN_URL;
    const clientId = process.env.SF_CLIENT_ID;
    const clientSecret = process.env.SF_CLIENT_SECRET;
    const username = process.env.SF_USERNAME;
    const password = process.env.SF_PASSWORD;

    // Validate required environment variables
    if (!clientId || !clientSecret || !username || !password) {
      return res.status(500).json({
        success: false,
        error:
          "Missing required Salesforce credentials in environment variables",
        debug: {
          clientId: !!clientId,
          clientSecret: !!clientSecret,
          username: !!username,
          password: !!password,
        },
      });
    }

    // OAuth2 password flow
    const tokenUrl = `${loginUrl}/services/oauth2/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("username", username);
    params.append("password", password);

    const response = await axios.post(tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, instance_url } = response.data;

    res.json({
      success: true,
      accessToken: access_token,
      instanceUrl: instance_url,
      message: "Access token obtained successfully",
    });
  } catch (error) {
    console.error("❌ Token error:", error);

    res.status(401).json({
      success: false,
      error: "Failed to get Salesforce access token",
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data
          : undefined,
    });
  }
});

/**
 * POST /api/auth/login
 * Login user using Salesforce custom API
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, accessToken } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: "Salesforce access token is required",
      });
    }

    // Call Salesforce custom REST API
    const salesforceApiUrl =
      "https://japanese-listening-dev-ed.develop.my.salesforce.com/services/apexrest/api/login";

    const loginResponse = await axios.post(
      salesforceApiUrl,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      data: loginResponse.data,
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    let errorMessage = "Login failed";

    if (error.response?.status === 401) {
      errorMessage = "Invalid credentials or expired token";
    } else if (error.response?.status === 404) {
      errorMessage = "User not found";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data
          : undefined,
    });
  }
});

/**
 * POST /api/auth/register
 * Register user using Salesforce custom API
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstname, lastname, level, accessToken } =
      req.body;

    // Validate input
    if (!email || !password || !firstname || !lastname || !level) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: "Salesforce access token is required",
      });
    }

    // Call Salesforce custom REST API
    const salesforceApiUrl =
      "https://japanese-listening-dev-ed.develop.my.salesforce.com/services/apexrest/api/register";

    const registerResponse = await axios.post(
      salesforceApiUrl,
      {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        level: level,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      data: registerResponse.data,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

    let errorMessage = "Registration failed";

    if (error.response?.status === 400) {
      errorMessage = "Invalid input data";
    } else if (error.response?.status === 409) {
      errorMessage = "User already exists";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data
          : undefined,
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email using Salesforce custom API
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, accessToken } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: "Salesforce access token is required",
      });
    }

    // Call Salesforce custom REST API
    const salesforceApiUrl =
      "https://japanese-listening-dev-ed.develop.my.salesforce.com/services/apexrest/api/password/forgot";

    const forgotPasswordResponse = await axios.post(
      salesforceApiUrl,
      {
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      data: forgotPasswordResponse.data,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);

    let errorMessage = "Failed to send password reset email";

    if (error.response?.status === 404) {
      errorMessage = "User not found";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data
          : undefined,
    });
  }
});

/**
 * POST /api/auth/verify-reset-token
 * Verify reset password token
 */
router.post("/verify-reset-token", async (req, res) => {
  try {
    const { token, accessToken } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: "Salesforce access token is required",
      });
    }

    // Call Salesforce custom REST API
    const salesforceApiUrl =
      "https://japanese-listening-dev-ed.develop.my.salesforce.com/services/apexrest/api/password/validate";

    const verifyTokenResponse = await axios.post(
      salesforceApiUrl,
      {
        token: token,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      data: verifyTokenResponse.data,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("❌ Verify token error:", error);

    let errorMessage = "Invalid or expired token";

    if (error.response?.status === 404) {
      errorMessage = "Token not found or expired";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    res.status(error.response?.status || 400).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data
          : undefined,
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset user password using token
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password, accessToken } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: "Token and password are required",
      });
    }

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: "Salesforce access token is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Call Salesforce custom REST API
    const salesforceApiUrl =
      "https://japanese-listening-dev-ed.develop.my.salesforce.com/services/apexrest/api/password/reset";

    const resetPasswordResponse = await axios.post(
      salesforceApiUrl,
      {
        token: token,
        newPassword: password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      data: resetPasswordResponse.data,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);

    let errorMessage = "Failed to reset password";

    if (error.response?.status === 400) {
      errorMessage = "Invalid token or password requirements not met";
    } else if (error.response?.status === 404) {
      errorMessage = "Invalid or expired reset token";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development"
          ? error.response?.data
          : undefined,
    });
  }
});

module.exports = router;
