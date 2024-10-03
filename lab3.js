var table = document.getElementById("table");
var button = document.getElementById("button");
document.querySelector('.Average').addEventListener('click', toggleGradePresentation);


button.addEventListener("click", function(){
    addRow();
});

function calculateRowAverage(row) {
    let sum = 0;
    let count = 0; 
    const assignments = row.querySelectorAll('.Assignments');

    assignments.forEach(assignment => {
        const value = parseInt(assignment.textContent); 
        if (!isNaN(value)) { 
            sum += value;
            count++;
        }
    });

    const average = count > 0 ? Math.round(sum / count) : 0; 
    const assignmentAverage = row.querySelector('.average');
    assignmentAverage.textContent = `${average}%`; 

  
    if (average < 60) {
        assignmentAverage.classList.add("average-below-60");
    } else {
        assignmentAverage.classList.remove("average-below-60");
    }
}


const rows = table.querySelectorAll('tr');
rows.forEach(row => {
    if (row.querySelector('.Assignments')) { 
        calculateRowAverage(row);
    }
});


table.addEventListener('input', function(event) {
    if (event.target.classList.contains('Assignments')) {
        const row = event.target.closest('tr'); // Find the parent row of the edited cell
        calculateRowAverage(row);
    }
});

document.getElementById("button").addEventListener("click", function() {
    const newRow = table.insertRow(-1); // Adds a new row at the end of the table
    newRow.innerHTML = `
        <td contenteditable="true">New Student</td>
        <td contenteditable="true">Student ID</td>
        <td contenteditable="true" class="Assignments">-</td>
        <td contenteditable="true" class="Assignments">-</td>
        <td contenteditable="true" class="Assignments">-</td>
        <td contenteditable="true" class="Assignments">-</td>
        <td contenteditable="true" class="Assignments">-</td>
        <td class="average">-</td>
    `;
    calculateRowAverage(newRow); // Calculate the average for the new row
    updateUnsubmittedAssignmentsAndStyle();
});


document.addEventListener('DOMContentLoaded', function () {
    updateUnsubmittedAssignmentsAndStyle(); // Initial update for page load
    
  
    function updateUnsubmittedAssignmentsAndStyle() {
      const rows = document.querySelectorAll('#table tr');
      let unsubmittedCount = 0;
  
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
          if (cell.textContent.trim() === "-") {
            cell.classList.add('unsubmitted'); // Add the styling class to unsubmitted assignments
            unsubmittedCount++;
          } else {
            cell.classList.remove('unsubmitted'); // Ensure correct styling 
          }
        });
      });
  
      // Update the count display
      document.getElementById('unsubmittedCount').textContent = `Unsubmitted Assignments: ${unsubmittedCount}`;
    }
  
   
    document.getElementById('table').addEventListener('input', function() {
      updateUnsubmittedAssignmentsAndStyle();
    });
  });
  
  document.getElementById("button2").addEventListener("click", function() {
    if (table.rows.length > 2) { // Check if there are rows to delete (excluding the header)
        table.deleteRow(-1); // Deletes the last row
    } else {
        alert("Cannot delete header row!");
    }
});
function percentToLetterGrade(percent) {
    if (percent >= 93) return 'A';
    if (percent >= 90) return 'A-';
    if (percent >= 87) return 'B+';
    if (percent >= 83) return 'B';
    if (percent >= 80) return 'B-';
    if (percent >= 77) return 'C+';
    if (percent >= 73) return 'C';
    if (percent >= 70) return 'C-';
    if (percent >= 67) return 'D+';
    if (percent >= 63) return 'D';
    if (percent >= 60) return 'D-';
    return 'F';
}

function percentTo4PointScale(percent) {
    if (percent >= 93) return '4.0';
    if (percent >= 90) return '3.7';
    if (percent >= 87) return '3.3';
    if (percent >= 83) return '3.0';
    if (percent >= 80) return '2.7';
    if (percent >= 77) return '2.3';
    if (percent >= 73) return '2.0';
    if (percent >= 70) return '1.7';
    if (percent >= 67) return '1.3';
    if (percent >= 63) return '1.0';
    if (percent >= 60) return '0.7';
    return '0.0';
}
let gradeDisplayMode = 0; // 0 for percent, 1 for letter, 2 for 4.0 scale

function toggleGradePresentation() {
    const averages = document.querySelectorAll('.average');
    averages.forEach(averageCell => {
        const percent = parseInt(averageCell.dataset.percent);
        if (!isNaN(percent)) {
            switch (gradeDisplayMode) {
                case 0:
                    averageCell.textContent = percentToLetterGrade(percent) + "%";
                    break;
                case 1:
                    averageCell.textContent = percentTo4PointScale(percent);
                    break;
                case 2:
                    averageCell.textContent = percent + "%"; 
                    break;
            }
        }
    });
    gradeDisplayMode = (gradeDisplayMode + 1) % 3; 

    let savedTableState = [];

function saveTableState() {
    const rows = document.querySelectorAll('#table tr:not(:first-child)'); // Exclude the header row
    savedTableState = []; // Reset the saved state

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => cell.textContent);
        savedTableState.push(rowData);
    });

    console.log('Table state saved', savedTableState);
}

function restoreTableState() {
    const table = document.getElementById('table');
    // Clear all rows except the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Reconstruct the table from the saved state
    savedTableState.forEach(rowData => {
        const newRow = table.insertRow(-1);
        rowData.forEach((text, index) => {
            const newCell = newRow.insertCell(index);
            newCell.textContent = text;
            if (index !== 0 && index !== 1 && index !== rowData.length - 1) { // Make assignments editable
                newCell.contentEditable = true;
                newCell.classList.add('Assignments');
            }
        });
    });

    // Recalculate averages, unsubmitted counts, etc., as needed
    updateUnsubmittedCount();
    // Assuming calculateRowAverage and any other necessary recalculation functions are called within
}

document.getElementById('saveTableState').addEventListener('click', saveTableState);
document.getElementById('restoreTableState').addEventListener('click', restoreTableState);

}
