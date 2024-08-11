let cumulativeCourseCount = 0;
let semesterCourseCount = 0;
let newCourseCount = 0;
let currentGPASystem = 5;

function selectGPASystem(system) {
    currentGPASystem = system;
    document.getElementById('gpaSelection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
    updatePlaceholders();
    addCourse('cumulative');
    addCourse('semester');
    addCourse('new');
}

function goBack() {
    document.getElementById('gpaSelection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
    resetCalculator();
}

function resetCalculator() {
    cumulativeCourseCount = 0;
    semesterCourseCount = 0;
    newCourseCount = 0;
    document.getElementById('cumulativeCourses').innerHTML = '';
    document.getElementById('semesterCourses').innerHTML = '';
    document.getElementById('newCourses').innerHTML = '';
    document.getElementById('cumulativeResult').innerHTML = '';
    document.getElementById('semesterResult').innerHTML = '';
    document.getElementById('gradeResult').innerHTML = '';
    document.getElementById('percentageResult').innerHTML = '';
    document.getElementById('updatedResult').innerHTML = '';
    document.getElementById('lastGPA').value = '';
    document.getElementById('gpaToConvert').value = '';
    document.getElementById('oldGPA').value = '';
    document.getElementById('oldCredits').value = '';
}

function updatePlaceholders() {
    const maxGPA = currentGPASystem;
    document.getElementById('lastGPA').placeholder = `أدخل آخر معدل (0-${maxGPA})`;
    document.getElementById('gpaToConvert').placeholder = `أدخل GPA للتحويل (0-${maxGPA})`;
    document.getElementById('oldGPA').placeholder = `GPA القديم (0-${maxGPA})`;
}

function showSection(sectionId) {
    document.querySelectorAll('.calculator').forEach(calc => calc.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    document.querySelectorAll('.section-button').forEach(button => {
        button.classList.remove('active-section');
    });
    event.target.classList.add('active-section');
}

function addCourse(type) {
    const coursesDiv = document.getElementById(type + 'Courses');
    const newCourse = document.createElement('div');
    newCourse.className = 'course-input';
    newCourse.innerHTML = `
        <input type="number" placeholder="عدد الساعات" class="course-credits" min="1" step="1">
        <input type="number" placeholder="درجة المادة" class="course-grade" min="0" max="100" step="0.01">
        <button class="remove-course" onclick="removeCourse(this, '${type}')">حذف المادة</button>
    `;
    coursesDiv.appendChild(newCourse);
    if (type === 'cumulative') cumulativeCourseCount++;
    else if (type === 'semester') semesterCourseCount++;
    else if (type === 'new') newCourseCount++;
}

function removeCourse(button, type) {
    button.parentElement.remove();
    if (type === 'cumulative') cumulativeCourseCount--;
    else if (type === 'semester') semesterCourseCount--;
    else if (type === 'new') newCourseCount--;
}

function calculateGPA(type) {
    const courses = document.getElementById(type + 'Courses').getElementsByClassName('course-input');
    let totalCredits = 0;
    let totalGradePoints = 0;
    let error = false;
    let errorMessage = '';

    for (let course of courses) {
        const credits = parseFloat(course.querySelector('.course-credits').value);
        const grade = parseFloat(course.querySelector('.course-grade').value);

        if (isNaN(credits) || credits <= 0) {
            error = true;
            errorMessage = 'يجب أن تكون عدد الساعات أكبر من 0';
            break;
        }
        if (isNaN(grade) || grade < 0 || grade > 100) {
            error = true;
            errorMessage = 'يجب أن تكون درجة المادة بين 0 و 100';
            break;
        }

        totalCredits += credits;
        totalGradePoints += credits * calculatePoints(grade);
    }

    const resultElement = document.getElementById(type + 'Result');
    if (error || totalCredits === 0) {
        resultElement.innerHTML = `<span class="error">${errorMessage || 'الرجاء إدخال معلومات المواد بشكل صحيح.'}</span>`;
    } else {
        const gpa = totalGradePoints / totalCredits;
        const gradeDescription = getGradeDescription(gpa);
        if (type === 'cumulative') {
            resultElement.innerHTML = `معدلك التراكمي (GPA) هو: <span class="highlight">${gpa.toFixed(2)}</span> - تقديرك: <span class="highlight">${gradeDescription}</span>`;
        } else {
            resultElement.innerHTML = `معدلك الفصلي هو: <span class="highlight">${gpa.toFixed(2)}</span> - تقديرك: <span class="highlight">${gradeDescription}</span>`;
        }
    }
}

function calculatePoints(grade) {
    if (currentGPASystem === 5) {
        if (grade >= 85) return 3.5 + ((grade - 85) / 15) * 1.5;
        if (grade >= 75) return 2.5 + ((grade - 75) / 10);
        if (grade >= 65) return 1.5 + ((grade - 65) / 10);
        if (grade >= 60) return 1 + ((grade - 60) / 5) * 0.5;
        return 0;
    } else {
        if (grade >= 90) return 4.0;
        if (grade >= 85) return 3.7;
        if (grade >= 80) return 3.3;
        if (grade >= 75) return 3.0;
        if (grade >= 70) return 2.7;
        if (grade >= 65) return 2.3;
        if (grade >= 60) return 2.0;
        if (grade >= 55) return 1.7;
        if (grade >= 50) return 1.3;
        if (grade >= 45) return 1.0;
        return 0;
    }
}

function getGradeDescription(gpa) {
    if (currentGPASystem === 5) {
        if (gpa >= 3.5) return "امتياز";
        if (gpa >= 2.5) return "جيد جدا";
        if (gpa >= 1.5) return "جيد";
        if (gpa >= 1) return "مقبول";
        return "راسب";
    } else {
        if (gpa >= 3.7) return "امتياز مرتفع";
        if (gpa >= 3.3) return "امتياز";
        if (gpa >= 3.0) return "جيد جدا مرتفع";
        if (gpa >= 2.7) return "جيد جدا";
        if (gpa >= 2.3) return "جيد مرتفع";
        if (gpa >= 2.0) return "جيد";
        if (gpa >= 1.7) return "مقبول مرتفع";
        if (gpa >= 1.3) return "مقبول";
        if (gpa >= 1.0) return "مقبول منخفض";
        return "راسب";
    }
}

function estimateGrade() {
    const lastGPA = parseFloat(document.getElementById('lastGPA').value);
    const gradeResult = document.getElementById('gradeResult');
    const maxGPA = currentGPASystem;
    if (!isNaN(lastGPA) && lastGPA >= 0 && lastGPA <= maxGPA) {
        const gradeDescription = getGradeDescription(lastGPA);
        gradeResult.innerHTML = `تقديرك هو: <span class="highlight">${gradeDescription}</span>`;
    } else {
        gradeResult.innerHTML = `<span class="error">يرجى إدخال معدل صحيح بين 0 و ${maxGPA}.</span>`;
    }
}

function convertGPAToPercentage() {
    const gpa = parseFloat(document.getElementById('gpaToConvert').value);
    const percentageResult = document.getElementById('percentageResult');
    const maxGPA = currentGPASystem;
    if (!isNaN(gpa) && gpa >= 0 && gpa <= maxGPA) {
        let percentage;
        if (currentGPASystem === 5) {
            if (gpa >= 3.5) {
                percentage = 85 + ((gpa - 3.5) / 1.5) * 15;
            } else if (gpa >= 2.5) {
                percentage = 75 + ((gpa - 2.5) / 1) * 10;
            } else if (gpa >= 1.5) {
                percentage = 65 + ((gpa - 1.5) / 1) * 10;
            } else {
                percentage = 60 + ((gpa - 1) / 0.5) * 5;
            }
        } else {
            percentage = 60 + ((gpa - 1) / 3) * 40;
        }
        const gradeDescription = getGradeDescription(gpa);
        percentageResult.innerHTML = `نسبة نجاحك هي <span class="highlight">${percentage.toFixed(2)}%</span> وتقديرك هو <span class="highlight">${gradeDescription}</span>`;
    } else {
        percentageResult.innerHTML = `<span class="error">يرجى إدخال GPA صحيح بين 0 و ${maxGPA}.</span>`;
    }
}

function updateGPA() {
    const oldGPA = parseFloat(document.getElementById('oldGPA').value);
    const oldCredits = parseFloat(document.getElementById('oldCredits').value);
    const newCourses = document.getElementById('newCourses').getElementsByClassName('course-input');
    let newTotalCredits = oldCredits;
    let newTotalGradePoints = oldGPA * oldCredits;
    let error = false;
    let errorMessage = '';

    const maxGPA = currentGPASystem;
    if (isNaN(oldGPA) || oldGPA < 0 || oldGPA > maxGPA) {
        error = true;
        errorMessage = `يرجى إدخال GPA قديم صحيح بين 0 و ${maxGPA}`;
    }
    if (isNaN(oldCredits) || oldCredits < 0) {
        error = true;
        errorMessage = 'يرجى إدخال عدد ساعات معتمدة صحيح';
    }

    for (let course of newCourses) {
        const credits = parseFloat(course.querySelector('.course-credits').value);
        const grade = parseFloat(course.querySelector('.course-grade').value);

        if (isNaN(credits) || credits <= 0) {
            error = true;
            errorMessage = 'يجب أن تكون عدد الساعات أكبر من 0';
            break;
        }
        if (isNaN(grade) || grade < 0 || grade > 100) {
            error = true;
            errorMessage = 'يجب أن تكون درجة المادة بين 0 و 100';
            break;
        }

        newTotalCredits += credits;
        newTotalGradePoints += credits * calculatePoints(grade);
    }

    const updatedResult = document.getElementById('updatedResult');
    if (error) {
        updatedResult.innerHTML = `<span class="error">${errorMessage}</span>`;
    } else {
        const newGPA = newTotalGradePoints / newTotalCredits;
        const gradeDescription = getGradeDescription(newGPA);
        updatedResult.innerHTML = `معدلك التراكمي الجديد (GPA) هو: <span class="highlight">${newGPA.toFixed(2)}</span> - تقديرك: <span class="highlight">${gradeDescription}</span>`;
    }
}