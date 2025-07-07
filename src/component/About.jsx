import React, { useState, useEffect } from "react";
import {
    X, Heart, Star, MapPin, MoreVertical, ShieldBan,
    AlertTriangle, User, Dumbbell, Mic, Trees, Guitar, Film
} from "lucide-react";
import { HeartPlus } from "lucide-react";
import { Drumstick, CigaretteOff, Ban } from "lucide-react";
import { MdNoMeals, MdSmokeFree } from "react-icons/md";
import { Tent } from "lucide-react";
import { IoFitnessOutline } from "react-icons/io5";

import {
    IconButton, Menu, MenuItem, Avatar, Chip, Container
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { FaHandsClapping } from "react-icons/fa6";
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded";

import axiosMain from "../http/axiosMain"; // Your axios instance

const lifestyleIcons = {
    "Non-Vegetarian": Drumstick,
    Never: Ban,
    "Looking to Quit Smoking": CigaretteOff,
};

const avatarStyles = {
    bgcolor: "transparent",
    width: 20,
    height: 20,
};

const chipStyles = {
    backgroundImage: "linear-gradient(to right, rgba(255,153,153,1), rgba(255,102,102,1))",
    color: "white",
    border: "none",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    height: "28px",
};

const interestIcons = {
    Comedy: TheaterComedyRoundedIcon,
    Movies: Tent,
    Outdoors: Tent,
    Fitness: IoFitnessOutline,
};

export default function About({ aboutData }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [galleryImages, setGalleryImages] = useState([]);

    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const {
        id,
        name,
        dob,
        city,
        languages,
        professions,
        statuses,
        religions,
        about,
        interests = [],
        eating,
        drinking,
        smoking,
        url
    } = aboutData || {};

    const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : "--";

    const chipData = [
        { id: 1, label: statuses?.e_name, IconComponent: User },
        { id: 2, label: religions?.e_name, IconComponent: User },
        { id: 3, label: `${age} Years`, IconComponent: User },
        {
            id: 4,
            label: city?.e_name && city?.country?.e_name ? `${city.e_name}, ${city.country.e_name}` : null,
            IconComponent: MapPin,
        },
        { id: 5, label: languages?.e_name, IconComponent: User },
        { id: 6, label: professions?.e_name, IconComponent: User },
    ];

    const lifestyleChips = [eating?.e_name, drinking?.e_name, smoking?.e_name];

    useEffect(() => {
        if (id) {
            axiosMain
                .get(`/users/${id}/gallary`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setGalleryImages(res.data.map((item) => item.url));
                    }
                })
                .catch((err) => {
                    console.error("Gallery fetch failed:", err);
                });
        }
    }, [id]);

    return (
        <Container maxWidth="lg">
            <div className="mt-1 px-1 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Side - Profile Image */}
                    <div className="md:col-span-1 flex flex-col items-center mt-2">
                        <div className="relative aspect-2/3 rounded-4xl overflow-hidden max-w-xs mx-auto">
                            <img
                                src={url || "src/assets/IMG (1).png"}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white bg-opacity-70 rounded-full px-3 py-1 shadow-md">
                                <button className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9999] to-[#FF66CC] flex items-center justify-center">
                                    <X className="text-white" size={16} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                                    <HeartPlus className="text-white" size={20} />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9999] to-[#FF66CC] flex items-center justify-center">
                                    <Star className="text-white fill-white" size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center gap-2">
                            <button className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-2">
                                <X className="text-white" size={20} />
                            </button>
                            <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                                <FaHandsClapping />
                                Say Hello
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-start ">
                            <h2 className="text-lg font-semibold capitalize">{name}</h2>
                            <div className="flex items-center gap-2 text-sm text-black">
                                <MapPin size={16} color="#38BDF8" />
                                <span>{city?.e_name}, {city?.country?.e_name}</span>
                                <IconButton onClick={handleMenuClick}>
                                    <MoreVertical size={20} />
                                </IconButton>
                            </div>
                        </div>

                        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                            <MenuItem onClick={handleMenuClose} sx={{ px: 6, py: 0.5 }}>
                                <ShieldBan size={28} className="pr-3" /> Block
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} sx={{ px: 6, py: 0.5 }}>
                                <AlertTriangle size={28} className="pr-3" /> Report
                            </MenuItem>
                        </Menu>

                        <Divider sx={{ borderBottomWidth: 1, borderColor: "black", paddingTop: "-40px" }} />

                        {/* About Me */}
                        <h3 className="font-semibold text-lg mt-2">About Me</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {chipData.map(({ id, label, IconComponent }) =>
                                label ? (
                                    <Chip
                                        key={id}
                                        avatar={
                                            <Avatar sx={avatarStyles}>
                                                <IconComponent size={18} style={{ color: "white" }} />
                                            </Avatar>
                                        }
                                        label={label}
                                        variant="outlined"
                                        sx={chipStyles}
                                    />
                                ) : null
                            )}
                        </div>
                        <p className="text-black mt-2 text-sm leading-relaxed">
                            {about || "No about description provided."}
                        </p>

                        {/* Lifestyle */}
                        <h3 className="text-lg font-semibold mt-1">Life Style</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {lifestyleChips.map((tag, index) => {
                                const IconComponent = lifestyleIcons[tag];
                                return tag ? (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        variant="outlined"
                                        avatar={
                                            IconComponent && (
                                                <Avatar sx={avatarStyles}>
                                                    <IconComponent size={14} style={{ color: "white" }} />
                                                </Avatar>
                                            )
                                        }
                                        sx={chipStyles}
                                    />
                                ) : null;
                            })}
                        </div>

                        {/* Interests */}
                        <h3 className="text-lg font-semibold mt-1">Interested</h3>
                        <div className="flex items-center gap-6 mt-1 ml-3">
                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                                <img src="src/assets/Mask group.svg" alt="" />
                                <span>Entertainment</span>
                            </div>
                            <div className="flex items-center ml-10 gap-2 text-sm font-semibold text-gray-800">
                                <img src="src/assets/Mask group2.png" alt="" />
                                <span>Wellness</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {interests.map(({ interest }, index) => {
                                const label = interest?.e_name;
                                const IconComponent = interestIcons[label];
                                return (
                                    <Chip
                                        key={index}
                                        label={label}
                                        variant="outlined"
                                        avatar={
                                            IconComponent && (
                                                <Avatar sx={avatarStyles}>
                                                    <IconComponent size={14} style={{ color: "white" }} />
                                                </Avatar>
                                            )
                                        }
                                        sx={chipStyles}
                                    />
                                );
                            })}
                        </div>

                        {/* Gallery */}
                        <div className="mt-2">
                            <h2 className="text-lg font-semibold mb-2">Gallery</h2>
                            <div className="
                grid gap-3
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                lg:grid-cols-4 xl:grid-cols-5
              ">
                                {galleryImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="w-full overflow-hidden rounded-2xl cursor-pointer"
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
