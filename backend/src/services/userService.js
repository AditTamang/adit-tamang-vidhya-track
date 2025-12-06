import bcrypt from "bcrypt";
import pool from "../config/dbConnection.js";

export const getAllUsersService = async () => {
  const result = await pool.query(
    "SELECT id, name, email, role, status, phone_number, is_verified, created_at, updated_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};

export const getUserByIdService = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, role, status, phone_number, is_verified, created_at, updated_at FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};

export const createUserService = async ({
  name,
  email,
  password,
  role,
  status,
  phone_number,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, status, phone_number)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, role, status, phone_number, is_verified, created_at, updated_at`,
    [name, email, hashedPassword, role, status, phone_number]
  );

  return result.rows[0];
};

export const updateUserService = async (
  id,
  { name, email, password, role, status, phone_number }
) => {
  const fields = [];
  const values = [];
  let counter = 1;

  if (name) {
    fields.push(`name=$${counter++}`);
    values.push(name);
  }
  if (email) {
    fields.push(`email=$${counter++}`);
    values.push(email);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    fields.push(`password=$${counter++}`);
    values.push(hashedPassword);
  }
  if (role) {
    fields.push(`role=$${counter++}`);
    values.push(role);
  }
  if (status) {
    fields.push(`status=$${counter++}`);
    values.push(status);
  }
  if (phone_number) {
    fields.push(`phone_number=$${counter++}`);
    values.push(phone_number);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE users SET ${fields.join(
      ", "
    )}, updated_at=NOW() WHERE id=$${counter} 
    RETURNING id, name, email, role, status, phone_number, is_verified, created_at, updated_at
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 RETURNING id, name, email, role, status, phone_number, is_verified, created_at, updated_at",
    [id]
  );
  return result.rows[0];
};
