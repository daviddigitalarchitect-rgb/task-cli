# Task Manager CLI

A lightweight, command-line interface (CLI) to-do application built with Node.js. 

## Project Overview
This tool allows users to manage tasks directly from the terminal. It uses Node.js core modules (`fs`) to read and write data to a local JSON file, ensuring data persistence between commands. It parses command-line arguments using `process.argv` and features a fully colored interface using the `chalk` library.

## File Structure
* `todo.js`: The main application script containing all logic, command parsing, and file system operations.
* `todos.json`: The database file (auto-generated) that stores tasks persistently.
* `package.json`: Manages the project's dependencies (like chalk) and module settings (ES Modules).

## How to Run Commands

Run these commands in your terminal to interact with the task manager:

* **Add a task:** `node todo.js add "Buy groceries"`
* **List all tasks:** `node todo.js list`
* **List completed tasks:** `node todo.js list done`
* **Mark a task as done:** `node todo.js done <id>` (e.g., `node todo.js done 1`)
* **Delete a task:** `node todo.js delete <id>` (e.g., `node todo.js delete 1`)
* **Search tasks:** `node todo.js search "keyword"` (e.g., `node todo.js search "groceries"`)
* **Clear all tasks:** `node todo.js clear`