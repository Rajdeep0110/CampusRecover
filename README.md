# CampusRecover 🎓🔎

> **Lost today. Found tomorrow.**

CampusRecover is a student-focused **Lost & Found web application designed specifically for the Lovely Professional University (LPU) campus**.

The platform provides students with a simple and organized way to report lost belongings, report found items, upload item images, search for belongings, and improve the overall Lost & Found experience on campus.

---

## 📌 Project Status

**CampusRecover is approximately 95% complete and is currently in the final deployment stage.**

The core functionality, authentication system, Lost & Found management, image uploads, search and filtering, database integration, and user interface have been implemented.

The remaining work is **deployment of the application**.

---

## 🎯 Why CampusRecover?

Losing personal belongings on a large university campus can be frustrating.

Students may lose items such as:

- 🎧 Earphones
- 🧴 Water bottles
- ☂️ Umbrellas
- 🎒 Bags
- 📱 Mobile phones
- 💳 ID cards
- 📚 Books
- 🔑 Keys
- 💻 Electronic devices

In a campus environment, students may depend on informal communication channels or existing institutional mechanisms to locate their belongings.

CampusRecover was developed to explore a **student-oriented digital solution** for this real-world problem.

---

## 🏫 Designed for LPU Students

CampusRecover is specifically designed around the requirements and experiences of students at:

**Lovely Professional University (LPU)**  
**Phagwara, Punjab, India**

The platform focuses on making Lost & Found reporting and searching more convenient for the campus community.

The idea originated from observing real student experiences with misplaced belongings and the need for a more convenient way to report and discover such items.

---

## 🆚 CampusRecover vs UMS Lost & Found

CampusRecover is **not a copy of the UMS Lost & Found system**.

The project was developed by identifying limitations and student-experience gaps that can exist in a traditional institution-managed Lost & Found process and exploring how a dedicated student-focused web application could address them.

### Existing UMS Approach

The UMS Lost & Found mechanism provides an institution-managed method for handling Lost & Found reports.

### CampusRecover Approach

CampusRecover explores a more **student-centric web experience** with additional functionality such as:

| UMS Lost & Found | CampusRecover |
|---|---|
| Institution-managed approach | Student-focused approach |
| Basic reporting | Detailed item reporting |
| Limited visual identification | Image-based item reporting |
| Basic item listing | Search and filtering |
| Traditional reporting process | Dedicated web-based experience |
| Limited item details | Detailed location and item information |
| Centralized institutional mechanism | Student-oriented digital platform |

The purpose of CampusRecover is **not to reproduce UMS**, but to develop and evaluate a different approach focused on student usability and convenience.

---

## 💡 The Problem Behind the Project

The idea behind CampusRecover came from a simple question:

> **What happens when a student loses something on campus?**

A student may lose an item in a classroom, library, cafeteria, hostel, academic block, playground, or another campus location.

Finding the item can become difficult when there is no convenient way to:

- Report the lost item
- Report an item that has been found
- Upload an image
- Provide an exact location
- Search existing reports
- Filter relevant items
- Identify a possible match

CampusRecover attempts to bring these activities into one dedicated platform.

---

# 🚀 Main Objectives

CampusRecover aims to:

1. Provide students with an easy way to report lost belongings.
2. Allow students to report belongings they have found.
3. Allow users to upload images of reported items.
4. Provide detailed information about item locations.
5. Provide search and filtering functionality.
6. Provide secure user authentication.
7. Reduce dependency on informal communication channels.
8. Create a centralized digital Lost & Found experience.
9. Improve the process of identifying and recovering belongings.
10. Explore how technology can solve a practical campus problem.

---

# ✨ Key Features

## 🔐 User Authentication

CampusRecover includes an authentication system that allows users to:

- Create an account
- Log in
- Log out
- Reset forgotten passwords
- Reset passwords through email
- Maintain authenticated sessions

Passwords are securely hashed before being stored.

---

## 📦 Lost & Found Reporting

Users can report both:

### 🔴 Lost Items

Students can provide information about belongings they have lost.

### 🟢 Found Items

Students can report belongings they have found so that the owner can potentially identify them.

---

## 🖼️ Image Upload

Users can upload images along with item reports.

Images are stored using **Cloudinary**, allowing reported item images to be managed separately from the application.

Visual information can make it easier for students to recognize their belongings compared with relying only on text descriptions.

---

## 🔎 Search & Filtering

CampusRecover provides functionality to search and filter reported belongings.

This helps users find potentially relevant Lost & Found reports more efficiently.

---

## 📍 Detailed Item Information

Reported items can contain information such as:

- Item title
- Description
- Category
- Lost / Found type
- Location
- Date
- Image

---

## ✏️ Item Management

Users can manage reported items through functionality including:

- Create
- View
- Edit
- Delete

---

# 🛠️ Technology Stack

## Frontend

- HTML
- CSS
- JavaScript
- EJS
- Bootstrap

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Libraries & Tools

- Multer
- Cloudinary
- Joi
- bcrypt
- Nodemailer
- Express Session
- connect-mongo
