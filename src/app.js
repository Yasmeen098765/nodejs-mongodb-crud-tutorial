const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbname = 'proj-1';

// متغيرات عامة
let client = null;
let db = null;

// 1. Database connection function
async function connectDB() {
    try {  // try: attempts to execute the code inside
        if (!client) {  // Check for existing connection
            client = await mongoClient.connect(connectionUrl);
            db = client.db(dbname);  // Important: Get the database instance
            console.log(' Connected to database successfully');
        }
        return { client, db };
        // Returns an object containing:
        // client: Full MongoDB connection
        // db: Specific database instance (proj-1)
    } catch (error) {  // catch: catches any errors that occur in try
        console.error(' Error connecting to database:', error.message);
        throw error;  // throw error: re-throws the error to the function that called connectDB
    }
}



// 2. دالة إغلاق الاتصال
async function disconnectDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("##########################################")
        console.log(' Database connection closed');
        console.log("##########################################")
    }
}

async function addUser(userData) {
    try {
        const { db } = await connectDB();
        const result = await new Promise((resolve, reject) => {
            db.collection('users').insertOne(userData, (error, result) => {
                if (error) {
                    console.error(" Unable to insert data");
                    reject(error);  // رفض الـ Promise عند الخطأ
                    return;
                }
                console.log(` User added with ID: ${result.insertedId}`);
                resolve(result);  // حل الـ Promise عند النجاح
            });
        });
        return result;  // إرجاع النتيجة 
    } catch (error) {
        console.error(' Error adding user:', error.message);
        throw error;
    }
}





async function addUsers(usersArray) {
    try {
        // Basic input validation (important!)
        if (!Array.isArray(usersArray)) {
            throw new Error('usersArray must be an array');
        }
        
        if (usersArray.length === 0) {
            console.log('  Array is empty, no users to add');
            return { insertedCount: 0, insertedIds: [] };
        }

        const { db } = await connectDB();
        
        // Using async/await directly - this is the best approach!
        const result = await db.collection('users').insertMany(usersArray);
        
        console.log(` Added ${result.insertedCount} users successfully`);
        return result;
        
    } catch (error) {
        console.error(' Error adding users:', error.message);
        throw error;
    }
}

// 5. Find users (without callback)
async function findUsers(filter = {}, limit = 0) {
    try {
        const { db } = await connectDB();
        let query = db.collection('users').find(filter);

        if (limit > 0) {
            query = query.limit(limit);
        }

        const users = await query.toArray();
        // console.log(` Found ${users.length} user(s) with age ${filter.age}`);
        return users;
    } catch (error) {
        console.error(' Error finding users:', error.message);
        throw error;
    }
}

// 6. Count users (without callback)
async function countUsers(filter = {}) {
    try {
        const { db } = await connectDB();
        const count = await db.collection('users').countDocuments(filter);
        // console.log(` Number of users: ${count} with age ${filter.age}`);
          console.log(`Number of users aged ${filter.age}: ${count}`);
        return count;
    } catch (error) {
        console.error(' Error counting users:', error.message);
        throw error;
    }
}

// 7. Find a user by ID (without callback)
async function findUserById(id) {
    try {
        const { db } = await connectDB();
        const user = await db.collection('users').findOne({
            _id: new ObjectId(id)
        });

        // if (user) {
        //     console.log(` User found: ${user.name} and age ${user.age}`);
        // } else {
        //     console.log(`User ${id} not found` );
        // }

        return user;
    } catch (error) {
        console.error(' Error finding user:', error.message);
        throw error;
    }
}


// Example 1: Adding individual users (like run())
async function example1() {
    console.log('\n======= Example 1: Adding Individual Users =======');

    try {
        // First user
        const result1 = await addUser({
            name: 'Ahmed',
            age: 20
        });
        console.log(`First ID: ${result1.insertedId}`);

        // Second user
        const result2 = await addUser({
            name: 'Mohammed',
            age: 21
        });
        console.log(`Second ID: ${result2.insertedId}`);

    } catch (error) {
        console.error('Example 1 failed:', error.message);
    }
}

// Example 2: Adding multiple users 
async function example2() {
    console.log('\n======= Example 2: Adding Multiple Users =======');

    try {
        const result = await addUsers([
            { name: 'Fatima', age: 22 },
            { name: 'Ali', age: 23 },
            { name: 'Zainab', age: 24 },
            { name: 'Khalid', age: 25 },
            { name: 'Noor', age: 26 },
            { name: 'Sara', age: 27 },
            { name: 'Yousef', age: 27 },
            { name: 'Layla', age: 27 },
            { name: 'Omar', age: 27 },
            { name: 'Huda', age: 27 }
        ]);

        // console.log(` Added ${result.insertedCount} users successfully`);

    } catch (error) {
        console.error(' Example 2 failed:', error.message);
    }
}

// Example 3: Finding users 
async function example3() {
    console.log('\n======= Example 3: Finding Users =======');

    try {
        const users = await findUsers({ age: 27 }, 5);
        console.log('Users with age 27:');
        users.forEach(user => {
            console.log(`- ${user.name} (Age: ${user.age})`);
        });

    } catch (error) {
        console.error(' Example 3 failed:', error.message);
    }
}

// Example 4: Counting users 
async function example4() {
    console.log('\n======= Example 4: Counting Users =======');
    try {
        const count = await countUsers({ age: 27 });
        // console.log(`Number of users aged 27: ${count}`);

    } catch (error) {
        console.error(' Example 4 failed:', error.message);
    }
}

// Example 5: Finding a user by ID 
async function example5(id) {
    console.log('\n======= Example 5: Find User by ID =======');

    try {
        const user = await findUserById(id);
        if (user) {
            console.log('User Details:');
            console.log(`Name: ${user.name}`);
            console.log(`Age: ${user.age}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log(' User id:('+ id +') not found');
        }

    } catch (error) {
        console.error(' Example 5 failed:', error.message);
    }
}


// ##########################################
// Main function to run all examples
// ##########################################
async function runAllExamples() {
    console.log(' Starting all examples...\n');

    try {
        // Connect to database once
        await connectDB();

        // Run examples in sequence
        await example1();
        await example2();
        await example3();
        await example4();
        await example5("693969b6b49512fd74935e43");
    } catch (error) {
        console.error(' Error during execution:', error.message);
    } finally {
        // Close connection at the end
        await disconnectDB();
        console.log('\n All operations completed');
    }
}

// Run the examples
runAllExamples();












