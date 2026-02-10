# Backend

## Setup
  
<ol>
  <li>
    First verify that your system has nodejs or not by entering this command<br/>
    <code>node --version</code><br/>
    <code>npm --version</code>
  </li><br/>
  <li>
    If <code>nodejs</code> is not installed. Install it using the command<br/>
    <ul>
      <li>
    For debian based system<br/>
    <code>sudo apt install nodejs</code><br/>
      </li>
      <li>
    For arch based system<br/>
    <code>sudo pacman -S nodejs</code><br/>
      </li>
    </ul>
  </li><br/>
  <li>
    Then cd into the frontend dir then run this command<br/>
    <code>npm i</code>
  </li><br/>
  <li>
    After all the installation is done. Run this command<br/>
    <code>npm run dev</code>
  </li><br/>
  <li>
    You will get an output like :<br/>
      <code>> backend@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
[dotenv@17.2.4] injecting env (3) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
🚀 Server running on port 5000
✅ Connected to MongoDB</code>
  </li>
</ol>

Note : When I say press <code>o</code> you don't have to keep on holding the key <code>o</code> and press <code>Enter</code>. You just have to press the key <code>o</code> once and then press the <code>Enter</code> key.

Now press <code>o</code> and hit <code>Enter</code>. This will open the website in your browser.

Press <code>q</code> and hit <code>Enter</code> to stop the vite / server / or whatever it's called.
