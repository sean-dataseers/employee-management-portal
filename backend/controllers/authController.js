const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');

const signup = async (req, res) => {
  try{ 
    const {username, password, first_name, last_name, email} = req.body;
    if (!username || !password || !first_name || !last_name || !email) {
      return res.status(400).json({ message: 'Please enter all fields'})
    }
    const usernames = await db.User.findOne({where: { username }});
    if (usernames) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    const employeeRole = await db.Role.findOne({ where: { name: 'Employee' } });
    const employeeRoleId = employeeRole.id;
    const NewUser = await db.User.create({ username, password, role_id: employeeRoleId })

    const NewEmployee = await db.Employee.create ({ first_name, last_name, email, role_id: employeeRoleId, user_id: NewUser.id, status: 'Active' })

    return res.status(201).json({ message: 'Successfully signed up '})


  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check that both fields were provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // 2. Find the user by username
    const user = await db.User.findOne({ where: { username }, include: [ { model: db.Role }]});
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Compare the submitted password against the stored hash
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Create a JWT token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, role: user.Role.name, permission_level: user.Role.permission_level },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Send the token back
    return res.json({
      token,
      user: { id: user.id, username: user.username, role_id: user.role_id, role: user.Role.name, permission_level: user.Role.permission_level },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, signup };