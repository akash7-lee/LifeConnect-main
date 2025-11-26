 Project Overview

This is a full-stack web application designed to connect blood/organ donors with hospitals and recipients.
The system allows users to register as donors, search for donors based on blood group or organ type, and manage donation requests.

 Key Features
1. Donor Registration Module

Users can register by providing name, age, location, blood group and organ availability.

Form validation using JavaScript.

Data stored securely in MySQL using Django ORM.

2. Donor Search System

Hospitals or users can search donors by:

Blood Group

Organ Type

Location

Implemented using Django query filters for fast searching.

3. Request Management

Hospitals can raise a donor request.

Donor receives a notification (email or dashboard alert).

4. Admin Dashboard

Admin can:

View all donors

Approve or reject donor registrations

Manage requests and user roles

Built with Django Admin customization.

Technical Implementation
Backend (Django)

Used Django Models to represent donors and requests.

Implemented CRUD operations for donor and request data.

Used Django URLs + Views + Templates (MVT Architecture).

#Frontend

HTML for structure

CSS for styling

JavaScript for dynamic form validation & search filters


#Database

MySQL relational database

Tables: Donor, Request, Hospital, UserProfile

#APIs

Created REST-like endpoints for:

Get donor list

Search donors

Returned data in JSON for frontend integration.

#Challenges Faced

Validating donor data (age, blood type format)

Handling many-to-many relationships between donors and hospitals

Implementing secure login authentication using Django’s inbuilt system

#What I Learned

Full-stack development using Django

Writing optimized database queries

Handling form validation and backend security

Building a real-world project with end-to-end flow
