## Room Booking System using Django and React



### Table of Contents

* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Setup](#setup)
* [Running the Application](#running-the-application)
* [Usage](#usage)

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone [https://github.com/user1880/Project](https://github.com/user1880/project)
    ```

## Prerequisites

Before getting started, please ensure you have the following:

* **Python 3.6 or later:** Download the latest version from https://www.python.org/downloads/
* **pip (package installer for Python):** Instructions to install pip can be found
  at https://pip.pypa.io/en/stable/installation/
* **A code editor or IDE:**
    * Visual Studio Code: https://code.visualstudio.com/
    * PyCharm: https://www.jetbrains.com/pycharm/
* **(Optional) Git for version control:** https://git-scm.com/

## Setup

Follow these steps to set up your development environment:

**1. Create a Virtual Environment**

It's highly recommended to work within a virtual environment to manage your project's dependencies effectively.

* **Windows:**
  ```bash
  python -m venv env
  env\Scripts\activate.bat 
  ```

* **macOS/Linux:**
  ```bash
  python3 -m venv env
  source env/bin/activate
  ```

**2. Install Dependencies**

The `requirements.txt` file contains all the necessary Python packages for your project. Install them using pip:

   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

To start your Django REST API locally:

1. **Apply Migrations**

   Make sure your database is up-to-date with your project's models:

   ```bash
   python manage.py makemigrations
   ```

   ```bash
   python manage.py migrate
   ```

2. **Collect Static**

   Before deploying your application, it's essential to collect all static files into a central location:

     ```bash
   python manage.py collectstatic
   ```

3. **Create a Superuser**

   To manage your Django project through the admin interface, you'll need to create a superuser account:

     ```bash
   python manage.py createsuperuser
   ```

4. **Runserver**

   To start the development server and begin testing your API:

     ```bash
   python manage.py createsuperuser
   ```

5. **To run celery & automated task**

   Install Redis(.msi file) from following link (for Windows), install in the Windows drive (C Drive)

     ```bash
   https://github.com/tporadowski/redis/releases
   ```

6. **Open Terminal - 2 and run command**

     ```bash
   celery -A djangoProject.celery worker --pool=solo -l info
   ```

7. **Open Terminal - 3 and run command**

     ```bash
   celery -A djangoProject beat -l INFO
   ```
                                    
7. **username and password**

     ```bash
   username:root
   ```
   
    ```bash
       password:root
   ```


# Now The React Part 

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.






