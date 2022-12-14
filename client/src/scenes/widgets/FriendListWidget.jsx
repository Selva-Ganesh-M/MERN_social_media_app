import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/state";

const FriendListWidget = ({ userId }) => {
  console.log({
    inside: "friendlistWidget",
    values: {
      userId: userId,
    },
  });
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);

  const getFriends = async () => {
    console.log("getting friends");
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log("data", data);
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    console.log("effect");
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const friends = useSelector((state) => state.user.friends);
  console.log("before printing friends");
  console.log(friends);
  return (
    <WidgetWrapper
      sx={{
        position: isNonMobileScreens ? "sticky" : "static",
        top: isNonMobileScreens ? "530px" : null,
      }}
    >
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.length > 0
          ? friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstname} ${friend.lastname}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          : null}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
