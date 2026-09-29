# CampusRecover 🎓🔎

> **Lost today. Found tomorrow.**

CampusRecover is a student-focused Lost & Found web application designed for the Lovely Professional University (LPU) campus.

The idea behind the project came from a simple problem that students can face on a large campus — losing personal belongings such as water bottles, earphones, umbrellas, ID cards, books, bags, or other items and finding it difficult to report or locate them.

CampusRecover provides a dedicated platform where students can directly report lost or found items, upload images, search existing reports, and manage the items they have reported.

---

## 📌 Project Status

**CampusRecover is completed and deployed. 🚀**

The project includes:

- User registration and login
- Logout and session management
- Password reset through email
- Lost item reporting
- Found item reporting
- Image uploads
- Search and filtering
- Item management
- Ownership-based edit and delete authorization
- MongoDB database integration
- Cloudinary image storage
- Email functionality
- Input validation
- Production deployment

---

# 🎯 Why CampusRecover?

Losing something on a large university campus can be frustrating.

A student might lose an item in a classroom, library, cafeteria, hostel, academic block, playground, parking area, or somewhere else on campus. Finding it again can become difficult when there is no convenient way for students to directly report and search for these belongings.

Students may have to depend on institutional reporting mechanisms or informal communication channels when they lose or find something.

One of the reasons for building CampusRecover was to explore a more direct approach where students themselves can create Lost & Found reports and provide useful information such as an image, description, location, and date.

CampusRecover brings these activities together in one dedicated platform.

---

# 🏫 Designed for LPU Students

CampusRecover was developed with the student experience at:

**Lovely Professional University (LPU)**  
**Phagwara, Punjab, India**

in mind.

The idea originated from observing real student experiences with misplaced belongings and thinking about how a web application could make the Lost & Found process easier and more convenient.

The application is designed around common situations students may experience on a university campus.

---

# 🆚 CampusRecover vs UMS Lost & Found

CampusRecover was developed after observing the existing Lost & Found process from a student's perspective.

The UMS Lost & Found provides an institution-managed mechanism for handling certain Lost & Found items. However, the items listed there are mainly belongings that are found in classrooms or buildings and submitted through the university's existing process.

Students do not directly create and manage Lost & Found posts themselves through the UMS process.

Because of this, the existing process has a more limited scope. It does not provide a general student-driven platform where students can directly report any type of lost or found belonging from different areas across the campus.

For example, a student may lose a water bottle near a playground, earphones in a cafeteria, an umbrella near a hostel, an ID card somewhere on campus, or another personal belonging outside a classroom or building.

CampusRecover takes a more student-focused approach by allowing students to directly create Lost & Found reports and provide details such as images, descriptions, locations, and dates.

| UMS Lost & Found | CampusRecover |
|---|---|
| Institution-managed process | Student-focused platform |
| Mainly lists items found in classrooms/buildings | Students can report items from different campus locations |
| Students do not directly create and manage posts | Students can directly create and manage reports |
| More limited scope of listed items | Broader Lost & Found reporting |
| Limited visual information | Image-based item reporting |
| Traditional reporting process | Direct web-based reporting |
| Basic item information | Detailed item information |
| Limited search experience | Search and filtering |
| Limited control for students | Users can manage their own reports |

CampusRecover is **not intended to replace or reproduce UMS**. It was developed to explore a broader and more convenient Lost & Found experience where students can directly report and search for belongings across the campus.

---

# 💡 The Problem Behind the Project

The idea behind CampusRecover came from a simple question:

> **What happens when a student loses something on campus?**

A student may lose an item in a classroom, library, cafeteria, hostel, academic block, playground, parking area, or another campus location.

Even when the student knows approximately where the item was lost, finding it can still be difficult.

For example, a student might lose:

- 🎧 Earphones
- 🧴 Water bottle
- ☂️ Umbrella
- 🎒 Bag
- 📱 Mobile phone
- 💳 ID card
- 📚 Books
- 🔑 Keys
- 💻 Electronic device

Without a convenient student-driven platform, students may need to depend on institutional processes or informal communication channels.

CampusRecover attempts to bring the basic Lost & Found workflow into one dedicated web application.

---

# 🚀 Main Objectives

The main objectives of CampusRecover are:

1. Make Lost & Found reporting easier for students.
2. Allow students to directly report lost belongings.
3. Allow students to report belongings they have found.
4. Allow users to upload images with their reports.
5. Provide useful location and item details.
6. Make reported items easier to search and filter.
7. Provide user authentication and session management.
8. Allow users to manage the items they have reported.
9. Prevent users from modifying another user's reports.
10. Provide password recovery functionality.
11. Reduce dependency on informal communication for Lost & Found reporting.
12. Explore how a full-stack web application can solve a practical campus problem.

---

# ✨ Key Features

## 🔐 User Authentication

CampusRecover provides a complete authentication system.

Users can:

- Create an account
- Log in
- Log out
- Maintain an authenticated session
- Reset a forgotten password
- Receive password reset instructions through email

Passwords are hashed before being stored in the database rather than being stored as plain text.

---

## 🔴 Lost Item Reporting

Students can report belongings they have lost.

A report can contain information such as:

- Item name
- Description
- Category
- Location
- Date
- Image

This provides other students with useful information when searching for a lost item.

---

## 🟢 Found Item Reporting

Students can also report items they have found.

A student who finds a water bottle, bag, ID card, earphones, or another belonging can create a report and provide details about where it was found.

This gives the owner a chance to identify the item.

---

## 🖼️ Image Uploads

Users can upload images along with their Lost & Found reports.

Images are stored using **Cloudinary** instead of being stored directly on the application server.

Images provide visual information that can make it easier for students to recognize their belongings.

For example, instead of only seeing:

> Blue water bottle found near the library.

a user can also see an actual image of the bottle.

---

## 🔎 Search & Filtering

CampusRecover provides search and filtering functionality to help users find relevant reports more easily.

Instead of manually going through every reported item, users can search and filter the available reports.

This makes it easier to find potentially matching Lost & Found items.

---

## 📍 Detailed Item Information

Each item report can contain details such as:

- Title
- Description
- Category
- Lost / Found type
- Location
- Date
- Image

Providing these details makes the reports more useful to other students.

---

## ✏️ Item Management

Users can manage the items they have reported.

They can:

- Create items
- View items
- Edit their own items
- Delete their own items

### Ownership Protection

An important part of CampusRecover is that users cannot modify another user's report.

For example:

```text
User A reports an item
        ↓
User A can Edit/Delete it       ✅
        ↓
User B views the same item
        ↓
User B cannot Edit/Delete it    ❌
