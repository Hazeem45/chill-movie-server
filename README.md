# Setup Project

1. **Clone the Repository**

   ```bash
   git clone git@github.com:Hazeem45/chill-movie-server.git
   cd chill-movie-server
   ```

2. **Create `.env` file** by running the following command:

   ```bash
   echo "DB_HOST=localhost" > .env
   echo "DB_USER=root" >> .env
   echo "DB_PASSWORD=" >> .env
   echo "DB_NAME=chill_movie" >> .env
   echo "ADMIN_PRIVILEGE_KEY=custom-your-key" >> .env
   echo "ACCESS_TOKEN_SECRET=custom-your-key" >> .env
   echo "REFRESH_TOKEN_SECRET=custom-your-key" >> .env
   ```

   _(Alternatively, you can create the `.env` file manually with the following command and edit it afterwards)_

   ```bash
   touch .env
   ```

   Then, manually add the following content to the `.env` file:

   ```
   DB_HOST=localhost 							# or 127.0.0.1
   DB_USER=root 									# username database
   DB_PASSWORD= 									# set this if you have a password for the root username
   DB_NAME=chill_movie 							# database name
   ADMIN_PRIVILEGE_KEY=custom-your-key 	# access admin without login as admin
   ACCESS_TOKEN_SECRET=custom-your-key 	# access token secret key
   REFRESH_TOKEN_SECRET=custom-your-key 	# refresh token secret key
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Setup Database:**

   -  Log in to MySQL:

      ```bash
      mysql -u root -p
      ```

      _(If no password, use `mysql -u root`)_

   -  Run the SQL script:

      ```bash
      source database/schema.sql;
      ```

5. **Run the application:**

   ```bash
   npm run dev
   ```
