# How to run & contribute:

## Step 1: Install Git
[This page](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) has instructions on installing Git on Windows or Mac.

## Step 2: Install Node
Download Node.js [from here](https://nodejs.org/en/download/) and just run the installer.

## Step 3: Getting the code
Open up a terminal (with ctrl+shift+right click) in the folder where you want to download the code and run:
`git clone https://github.com/nmde/hrudey.git`
This will download the latest version of all the code to your computer, and then you can open it in Visual Studio Code.

## Step 4: Setting up
In VS Code, press ctrl+shift+` to open a new terminal in the project folder. In the new terminal, run:
`npm install && npm run build`
This will take a while, but once its done, you can run `npm start` to start the app's server on your computer. You can then access the app in your browser at http://localhost:3000/.