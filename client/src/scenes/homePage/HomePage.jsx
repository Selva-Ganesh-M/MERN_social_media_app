import { Box, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  return (
    <Box>
      {/* navbar */}
      <Navbar />

      {/* home main */}
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* user details */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            // {isNonMobileScreens? (sx={{ position: "sticky", top: "130px" }}) : (null) }
            userId={_id}
            picturePath={picturePath}
          />
        </Box>

        {/* main-feed */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>

        {/* advert and FriendListWidget */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
