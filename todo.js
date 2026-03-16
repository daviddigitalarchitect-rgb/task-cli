// 1. Import the built-in File System tool from Node.js
import fs from 'fs';

import chalk from 'chalk';


// 2. Set the name of our database file
const FILE_PATH = './todos.json';

// --- THE BRIDGE FUNCTIONS ---

// Function to read our saved tasks
function loadTasks() {
    try {
        // Try to read the file and convert it from raw text into a JavaScript array
        const dataBuffer = fs.readFileSync(FILE_PATH);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        // EXPERT MOVE: If the file does not exist yet, fs.readFileSync will fail.
        // Instead of crashing the whole app, we catch the error and return an empty array.
        // This makes our app safe and crash-proof.
        return [];
    }
}

// Function to save our tasks back into the file
function saveTasks(tasks) {
    // Convert the JavaScript array back into raw text. 
    // EXPERT MOVE: The 'null, 2' arguments format the text with nice spacing, 
    // making the .json file very easy for a human to read.
    const dataJSON = JSON.stringify(tasks, null, 2);
    
    // Overwrite the file with the new data
    fs.writeFileSync(FILE_PATH, dataJSON);
}





// --- TASK LOGIC ---

// Helper function to create a simple, readable ID (1, 2, 3...)
function generateId(tasks) {
    if (tasks.length === 0) {
        return 1; // If list is empty, start at 1
    }
    // Find the highest existing ID and add 1
    const allIds = tasks.map(task => task.id);
    const highestId = Math.max(...allIds);
    return highestId + 1;
}

// Function to add a new task
function addTask(title) {
    // Stop the code if the user forgot to type a title
    if (!title) {
        // Wrapped the error in RED
        console.log(chalk.red('Error: Please provide a task title. Example: node todo.js add "Buy groceries"'));
        return;
    }

    const tasks = loadTasks(); // 1. Get the current list

    // 2. Create the new task object with required details
    const newTask = {
        id: generateId(tasks),
        title: title,
        status: 'pending',
        createdAt: new Date().toLocaleString() // Stamps it with the current date/time
    };

    tasks.push(newTask); // 3. Add it to our array
    saveTasks(tasks);    // 4. Save the updated array to the file
    
    // Wrapped the success message in GREEN
    console.log(chalk.green(`Success! Task added: "${title}" (ID: ${newTask.id})`));
}




// Function to list all tasks
function listTasks(filter) {
    const tasks = loadTasks(); // 1. Get the current list

    // Check if the list is completely empty
    if (tasks.length === 0) {
        // Yellow because it is not an error, just an alert that the list is empty
        console.log(chalk.yellow('No tasks found. Your list is empty!'));
        return;
    }

    let tasksToShow = tasks;

    // 2. If the user typed "list done", filter the list
    if (filter === 'done') {
        tasksToShow = tasks.filter(task => task.status === 'done');
    }

    // Check if there are no tasks matching the filter
    if (tasksToShow.length === 0) {
        console.log(chalk.yellow(`No tasks found with the status: ${filter}`));
        return;
    }

    // 3. Print the tasks. console.table makes a beautiful grid automatically!
    console.table(tasksToShow, ['id', 'title', 'status', 'createdAt']);
}




// Function to mark a task as 'done'
function markDone(id) {
    const tasks = loadTasks(); // 1. Get the current list

    // 2. Find the exact position (index) of the task in our list
    // We use parseInt(id) because terminal inputs are always text (strings), 
    // but our IDs were saved as actual numbers.
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

    // 3. Handle the edge case: What if they type an ID that doesn't exist?
    // findIndex returns -1 if it can't find a match.
    if (taskIndex === -1) {
        console.log(chalk.red(`Error: Task with ID ${id} not found.`));
        return; // Stop running the code so we don't crash
    }

    // 4. Update the status
    tasks[taskIndex].status = 'done';

    // 5. Save the updated list back to the file
    saveTasks(tasks);
    // Green for successful update
    console.log(chalk.green(`Success! Task #${id} marked as done.`));
}





// Function to delete a task completely
function deleteTask(id) {
    let tasks = loadTasks(); // 1. Get the current list
    const initialLength = tasks.length; // 2. Save how many tasks we currently have

    // 3. Filter out the task we want to delete. 
    // This keeps every task WHERE the ID does NOT match the one you typed.
    tasks = tasks.filter(task => task.id !== parseInt(id));

    // 4. Edge case check: Did we actually delete anything?
    // If the length is still the exact same, the ID didn't exist.
    if (tasks.length === initialLength) {
        console.log(chalk.red(`Error: Task with ID ${id} not found.`));
        return; // Stop the code here
    }

    // 5. Save the new, shorter list back to the file
    saveTasks(tasks);
    console.log(chalk.green(`Success! Task #${id} deleted.`));
}




// Function to wipe out all tasks
function clearTasks() {
    // 1. We don't even need to load the current tasks.
    // 2. We simply overwrite the database with a brand new, empty array.
    saveTasks([]); 
    
    console.log(chalk.green('Success! All tasks have been cleared. Fresh start!'));
}








// --- TERMINAL LISTENER ---

// Grab the 3rd and 4th words from the terminal (remember, counting starts at 0)
const command = process.argv[2];
const argument = process.argv[3];




// Function to search tasks by a specific keyword
function searchTasks(keyword) {
    // 1. Edge case check: Did they forget the keyword?
    if (!keyword) {
        console.log(chalk.red('Error: Please provide a search keyword. Example: node todo.js search "basics"'));
        return;
    }

    const tasks = loadTasks(); // 2. Get the current list

    // 3. Filter the list based on the keyword
    // We convert both the task title and the keyword to lowercase so "Node" and "node" will match perfectly.
    const matches = tasks.filter(task => 
        task.title.toLowerCase().includes(keyword.toLowerCase())
    );

    // 4. If we found nothing, let the user know
    if (matches.length === 0) {
        console.log(chalk.yellow(`No tasks found containing the word: "${keyword}".`));
        return;
    }

    // 5. If we found matches, print them out neatly!
    console.log(chalk.green(`Found ${matches.length} matching task(s):`));
    console.table(matches, ['id', 'title', 'status', 'createdAt']);
}







// Helper function to show instructions if someone uses the app wrong
function showHelp() {
    // Cyan makes the headers stand out, and we highlight the commands in green
    console.log(chalk.cyan('\n--- Task Manager CLI ---'));
    console.log('Usage: node todo.js <command> [arguments]');
    console.log('Commands:');
    console.log(`  ${chalk.green('add')} "title"   - Add a new task`);
    console.log(`  ${chalk.green('list')}          - Show all tasks`);
    console.log(`  ${chalk.green('list done')}     - Show only completed tasks`);
    console.log(`  ${chalk.green('done')} <id>     - Mark a task as done`);
    console.log(`  ${chalk.green('delete')} <id>   - Delete a task`);
    console.log(`  ${chalk.green('clear')}         - Delete all tasks`);
    console.log(`  ${chalk.green('search')} "word" - Search for a task by keyword`);
    console.log(chalk.cyan('------------------------\n'));
}




// Route the command to the right function
switch (command) {
    case 'add':
        addTask(argument);
        break;
    case 'list':               
        listTasks(argument);   // <-- This passes "done" if they type "list done"
        break;
    case 'done':               
        markDone(argument);    // <-- argument is the ID number they type
        break;
    case 'delete':             
        deleteTask(argument);  // <-- Passes the ID to delete
        break;
    case 'clear':             
        clearTasks();          // <-- No argument needed, it just wipes everything
        break;
    case 'search':             
        searchTasks(argument); // <-- Passes the keyword to search
        break;
    case undefined:
        // If the user types nothing after "node todo.js", show instructions
        showHelp();
        break;
    default:
        // If they type a command we haven't built yet
        console.log(chalk.red(`Error: Unknown command "${command}".`));
        showHelp();
        break;
}