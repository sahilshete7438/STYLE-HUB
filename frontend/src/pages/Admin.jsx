function Admin() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{
        display: "flex",
        gap: "20px"
      }}>
        <div>
          <h3>Total Products</h3>
        </div>

        <div>
          <h3>Total Orders</h3>
        </div>

        <div>
          <h3>Total Users</h3>
        </div>
      </div>
    </div>
  );
}

export default Admin;