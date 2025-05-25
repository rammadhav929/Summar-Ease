import React, { useState, useEffect } from 'react';
import { MongoClient } from 'mongodb';

const StudentsList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // TODO: Fetch the students data from MongoDB
    const client = new MongoClient('mongodb://localhost:27017');
    const db = client.db('my-app');
    const collection = db.collection('students');

    collection.find({}).toArray((err, docs) => {
      if (err) {
        console.log(err);
      } else {
        setStudents(docs);
      }
    });
  }, []);

  return (
    <ul>
      {students.map((student) => (
        <li key={student._id}>
          {student.name} - {student.rollNumber} - {student.collegeName}
        </li>
      ))}
    </ul>
  );
};

export default StudentsList;