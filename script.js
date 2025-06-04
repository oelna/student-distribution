const students = [
  {id: 1, firstName: 'Alice', lastName: 'Smith', gender: 'F', favorite: 2},
  {id: 2, firstName: 'Bob', lastName: 'Jones', gender: 'M', favorite: 1},
  {id: 3, firstName: 'Carol', lastName: 'Williams', gender: 'F', favorite: null},
  {id: 4, firstName: 'Dave', lastName: 'Brown', gender: 'M', favorite: 3},
  {id: 5, firstName: 'Eve', lastName: 'Johnson', gender: 'F', favorite: 4},
  {id: 6, firstName: 'Frank', lastName: 'Davis', gender: 'M', favorite: 7},
  {id: 7, firstName: 'Grace', lastName: 'Miller', gender: 'F', favorite: 6},
  {id: 8, firstName: 'Heidi', lastName: 'Wilson', gender: 'F', favorite: 9},
  {id: 9, firstName: 'Ivan', lastName: 'Moore', gender: 'M', favorite: 10},
  {id: 10, firstName: 'Judy', lastName: 'Taylor', gender: 'F', favorite: 9},
  {id: 11, firstName: 'Karl', lastName: 'Anderson', gender: 'M', favorite: null},
  {id: 12, firstName: 'Lena', lastName: 'Thomas', gender: 'F', favorite: null}
];

function findLeastPopulatedClass(classes) {
  let minIdx = 0;
  for (let i = 1; i < classes.length; i++) {
    if (classes[i].length < classes[minIdx].length) {
      minIdx = i;
    }
  }
  return minIdx;
}

function distributeStudents(students, numClasses) {
  const classes = Array.from({ length: numClasses }, () => []);
  const idMap = new Map(students.map(s => [s.id, s]));
  const assigned = new Set();

  // Place mutual favorites first
  for (const student of students) {
    if (!assigned.has(student.id) && student.favorite) {
      const fav = idMap.get(student.favorite);
      if (fav && fav.favorite === student.id && !assigned.has(fav.id)) {
        const idx = findLeastPopulatedClass(classes);
        classes[idx].push(student, fav);
        assigned.add(student.id);
        assigned.add(fav.id);
      }
    }
  }

  // Place one-sided favorites if possible
  for (const student of students) {
    if (!assigned.has(student.id) && student.favorite) {
      const favClassIndex = classes.findIndex(c => c.some(s => s.id === student.favorite));
      if (favClassIndex !== -1) {
        classes[favClassIndex].push(student);
        assigned.add(student.id);
      }
    }
  }

  // Distribute remaining students evenly
  for (const student of students) {
    if (!assigned.has(student.id)) {
      const idx = findLeastPopulatedClass(classes);
      classes[idx].push(student);
      assigned.add(student.id);
    }
  }

  return classes;
}

function displayClasses(classes) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  classes.forEach((cls, index) => {
    const div = document.createElement('div');
    div.className = 'class-group';
    const heading = document.createElement('h2');
    heading.textContent = `Class ${index + 1}`;
    div.appendChild(heading);
    const list = document.createElement('ul');
    cls.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.firstName} ${s.lastName}`;
      list.appendChild(li);
    });
    div.appendChild(list);
    output.appendChild(div);
  });
}

document.getElementById('run').addEventListener('click', () => {
  const num = parseInt(document.getElementById('classCount').value, 10);
  if (num > 0) {
    const result = distributeStudents(students, num);
    displayClasses(result);
  }
});
