import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import styled from "styled-components";
import { FaArrowLeft, FaEdit, FaSignOutAlt, FaBoxOpen, FaUserCircle } from "react-icons/fa";

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 1.8rem;
  margin-right: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #0a74da;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #222;
  margin: 0;
  flex-grow: 1;
  font-weight: 700;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  background: #e7f1ff;
  border-radius: 12px;
  border: 1px solid #b9d4ff;
  padding: 1.5rem 2rem;
  gap: 1.5rem;
  box-shadow: inset 0 0 10px #cde0ff;
`;

const UserIcon = styled(FaUserCircle)`
  font-size: 5rem;
  color: #4285f4;
`;

const UserDetailsWrapper = styled.div`
  flex-grow: 1;
`;

const UserDetails = styled.p`
  font-size: 1.15rem;
  margin: 0.3rem 0;
  color: #333;
  strong {
    color: #0a74da;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;

  ${({ variant }) =>
    variant === "logout"
      ? `
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #d32f2f;
    }
  `
      : variant === "edit"
      ? `
    background-color: #0a74da;
    color: white;

    &:hover {
      background-color: #075bb5;
    }
  `
      : `
    background-color: #eee;
    color: #333;

    &:hover {
      background-color: #ddd;
    }
  `}
`;

const OrdersContainer = styled.div``;

const OrderItem = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.3rem 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }

  p {
    margin: 0.25rem 0;
    font-size: 1rem;
    color: #444;

    strong {
      color: #0a74da;
    }
  }
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  color: #444;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }
      setUser(JSON.parse(storedUser));
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/order?email=${user.email}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    if (user?.email) fetchOrders();
  }, [user, setUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleEditAccount = () => {
    navigate("/edit-profile");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!user) return null;

  return (
    <ProfileContainer>
      <Header>
        <BackButton onClick={handleGoBack} aria-label="Go Back">
          <FaArrowLeft />
        </BackButton>
        <Title>My Profile</Title>
      </Header>

      <Section>
        <UserInfo>
          <UserIcon />
          <UserDetailsWrapper>
            <UserDetails>
              <strong>Name:</strong> {user.username || "User Name"}
            </UserDetails>
            <UserDetails>
              <strong>Email:</strong> {user.email}
            </UserDetails>

            <ButtonGroup>
              <Button variant="edit" onClick={handleEditAccount}>
                <FaEdit />
                Edit Account
              </Button>

              <Button variant="logout" onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </Button>
            </ButtonGroup>
          </UserDetailsWrapper>
        </UserInfo>
      </Section>

      <Section>
        <Subtitle>
          <FaBoxOpen /> Order History
        </Subtitle>
        <OrdersContainer>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <OrderItem key={order.id}>
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{order.total_amount}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.payment_method}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {order.transaction_id || "NULL"}
                </p>
                <p>
                  <strong>Tracking ID:</strong> {order.tracking_id || "N/A"}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Delivery Address:</strong> {order.address},{" "}
                  {order.city}
                </p>
              </OrderItem>
            ))
          )}
        </OrdersContainer>
      </Section>
    </ProfileContainer>
  );
};

export default Profile;
