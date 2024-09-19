EDU HUB is an online learning platform designed to enhance the interaction between students and teachers and streamline course management through an intuitive and user-friendly interface. The platform aims to facilitate efficient learning and communication by providing a comprehensive suite of features.

DEMO:
Heres a live demo of the project:https://youtu.be/dFZ0xuGAosY?si=a3G5IVAu-MVPKPNa

Features include:
    User Authentication:
    Users can sign up and log in to access personalized features and secure their accounts.
    Dashboard:
    Provides an overview of enrolled courses, schedules, and grades, allowing users to manage their academic activities effectively.
    Resources:
    Students can access and download learning materials and resources shared by their teachers, ensuring they have the necessary tools for their studies.
    Chat system:
    users can communicate with other users through a messaging system

Installation
Dependancies include:Python3, NodeJS version 20*, Django, react-router-dom, pusher-js, a Pusher account
Steps:
    1 clone the repo:git clone https://github.com/yourusername/EDU-HUB.git
    2 cd to project dir
    3 split the terminal into 2.In the first terminal, navigate to educationHub folder and in the second navigate to the      frontend folder
    4 navigate to Node js website to install node:https://nodejs.org/en/
    5 install the Django using 'python -m pip install Django' command
    6 install react-router-dom using the command 'npm install react-router-dom'
    7 install pusher-js using the cmd 'npm install pusher'
    8 head over to pusher.com to create an app for the messaging intergration.
    9 in both of the root folders, create a .env file with the following info:
        EMAIL_HOST_USER = your email
        EMAIL_HOST_PASSWORD = your email password
        DEFAULT_FROM_EMAIL = your default email address
        REACT_APP_API_KEY=retreive from the Pusher website dashboard
        REACT_APP_CLUSTER=retreive from the Pusher website dashboard
        PUSHER_APP_APP_ID = retreive from the Pusher website dashboard
        PUSHER_APP_SECRET = retreive from the Pusher website dashboard

Usage
To start the app, in the frontend folder run the cmd 'npm start' while in the educationHub folder, run the cmd 'python manage.py runserver'
Once started, the app will be available at http://localhost:3000.


Contributing
Contributions are welcome, heres how you can contribute:
    Fork the project.
    Create a new feature branch (git checkout -b feature-branch-name).
    Commit your changes (git commit -m 'Add some feature').
    Push to the branch (git push origin feature-branch-name).
    Create a Pull Request.

License
This project is licensed under the MIT License.

Contact
Created by Adnan Gard Obuya-gardobuyaadnan@gmail.com
Feel free to reach out for any questions or feedback!