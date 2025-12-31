const http = require('http');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { makeResAdapter, parseJson } = require('./utlis/HttpHelpers');
const User = require('./models/User');
const Project = require('./models/Project');
const authenticate = require('./utlis/Auth');

const server = http.createServer(async (req, res) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} : ${req.url}`);

  const resAdapter = makeResAdapter(res);

  // POST : "/register"
  if (req.method === 'POST' && req.url === '/register') {
    const { email, password } = await parseJson(req)

    if (!email) {
      return resAdapter.status(400).json({
        error: 'Email is required',
      });
    }

    if (!password) {
      return resAdapter.status(400).json({
        error: 'Password is required',
      });
    }

    try {

      const user = await User.create({email: email, password: password});

      return resAdapter.status(201).json({
        id: user.id,
        email: user.email
      });
    } catch (err) {
      return resAdapter.status(err.status || 500).json({
        error: err.message,
      });
    }
  }

  // POST : "/login"
  if (req.method === 'POST' && req.url === '/login') {
    const { email, password } = await parseJson(req);

    if (!email) {
      return resAdapter.status(400).json({
        error: 'Email is required',
      });
    }

    if (!password) {
      return resAdapter.status(400).json({
        error: 'Password is required',
      });
    }

    try {
      let user = await User.findByEmail(email);

      if (!user) {
        return resAdapter.status(400).json({
          error: 'Invalid email or password',
        });
      }

      const isValidPassword = await user.verifyPassword(password);

      if (!isValidPassword) {
        return resAdapter.status(400).json({
          error: 'Invalid email or password',
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      user = await user.update({
        access_token: token,
      });

      return resAdapter
        .status(200)
        .headers({
          'Authorization': `Bearer ${token}`,
          'Access-Control-Expose-Headers': 'Authorization'
        })
        .json({
          id: user.id,
          access_token: user.access_token,
        });
    } catch (err) {
      return resAdapter.status(err.status || 500).json({
        error: err.message
      });
    }
  }

  // GET : "/users/me"
  if (req.method === 'GET' && req.url === '/users/me') {

    try {

      const user = await authenticate(req, resAdapter);

      if (!user) {
        return;
      }

      return resAdapter.status(200).json({
        id: user.id,
        email: user.email,
      });
    } catch (err) {
      return resAdapter.status(err.status || 500).json({
        error: err.message,
      });
    }
  }

  // GET : "/projects"
  if (req.method === 'GET' && req.url === '/projects') {

    try {

      const user = await authenticate(req, resAdapter);

      if (!user) {
        return;
      }

      const projects = await Project.findByOwnerId(user.id);

      return resAdapter.status(200).json({
        owner_id: user.id,
        projects: projects || []
      });

    } catch (err) {
      return resAdapter.status(err.status || 500).json({
        error: err.message,
      });
    }
  }

  // POST : "/projects"
  if (req.method === 'POST' && req.url === '/projects') {

    try {

      const user = await authenticate(req, resAdapter);

      if (!user) {
        return;
      }

      const { name, description, owner_id } = await parseJson(req);

      if (!name) {
        return resAdapter.status(400).json({
          error: 'Name is required',
        });
      }

      if (!description) {
        return resAdapter.status(400).json({
          error: 'Description is required',
        });
      }

      if (!owner_id) {
        return resAdapter.status(400).json({
          error: 'Owner Id is required',
        });
      }

      if (owner_id !== user.id) {
        return resAdapter.status(400).json({
          error: 'owner_id must be current logged in user id'
        });
      }

      const project = await Project.create({
        name: name,
        description: description,
        owner_id: owner_id,
      });

      return resAdapter.status(200).json({
        id: project.id,
        name: project.name,
        description: project.description,
        owner_id: project.owner_id,
      });

    } catch (err) {
      return resAdapter.status(err.status || 500).json({
        error: err.message,
      });
    }
  }

  return resAdapter.status(404).json({
    error: 'Route Not Found',
  });
});

server.listen(config.port, () => {
  console.log(`Server running at: http://localhost:${config.port}`);
});
