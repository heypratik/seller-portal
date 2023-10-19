import { useCallback, useState } from 'react';

// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fd"

const uploadFile = (file: any, token: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "POST");

    return fetch(`${baseURL}/${postMediaEndpoint}`, {
        method: 'POST',
        body: fd,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
};

const handleImageChange = useCallback(
    async (e, imgObj: any) => {
        const files: File[] = Array.from(e.target.files);  // Convert FileList to array
        if (files.length > 0) {
            const uploadedKeys: string[] = [];
            for (const file of files) {
                try {
                    const response = await uploadFile(file, token);
                    if (response.status === 'success' && response.data.objectKey) {
                        uploadedKeys.push(response.data.objectKey);
                    } else {
                        console.error("Failed to upload image:", file.name);
                    }
                } catch (error) {
                    console.error("Error uploading the image:", file.name, error);
                }
            }
            imgObj(prevKeys => [...prevKeys, ...uploadedKeys]);  // Merge old and new objectKeys
        }
    },
    [token]
);