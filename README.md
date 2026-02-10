# Attsys 2.0 (Attendace System)

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
    Create an new directory/folder in your local system. <code>cd</code> into the newly created dir and <code>git init</code> it.
  </li><br/>
  <li>
    Then copy the ssh / https link from the repo<br/><br/>
    SSH : <code>git@github.com:bhavi-th/attsys2-0.git</code><br/>
    or<br/>
    HTTPS : <code>https://github.com/bhavi-th/attsys2-0.git</code><br/><br/>
    and run the command<br/><br/>
    <code>git remote add origin https://github.com/bhavi-th/attsys2-0.git</code><br/>
    or<br/>
    <code>git remote add origin git@github.com:bhavi-th/attsys2-0.git</code>
  </li><br/>
  <li>
    Pull the repo to your local system using the command<br/>
    <code>git pull origin main</code>
  </li><br/>
</ol>

Note : You will need the <code>.env</code> file to run the backend and frontend.
