import React, {useEffect, useState} from 'react';
import {Button, Card, CardContent, CardMedia} from "@mui/material";
import Box from "@mui/material/Box";
import {GridImage} from "../services/photo-helper";

interface Props {
    id: string
    url: string
    selectedImages: GridImage[]
    onSelect: (id: string, src: string) => void
    onRemove: (id: string) => void
}

export default function ImageCard(props: Props) {
    const {url, id, onSelect, onRemove, selectedImages} = props

    const isImageSelected = () => {
        return selectedImages.filter((image) => image.id == id).length > 0;
    }

    const [isSelected, setIsSelected] = useState<boolean>(isImageSelected);

    useEffect(() => {
        setIsSelected(isImageSelected)
    }, [selectedImages])

    return (
        <>
            <div>
                <Card sx={{maxWidth: 250, borderRadius: '10px', maxHeight: '350px'}}>
                    <CardMedia
                        component="img"
                        height="250"
                        image={url}
                    />
                    <CardContent>
                        <Box sx={{justifyContent: "space-between"}} flexGrow={1} display="flex">
                            <Button variant="contained" sx={{marginRight: '10px'}} size={'small'}
                                    disabled={isSelected} onClick={() => onSelect(id, url)}>Select</Button>
                            <Button variant="contained" color="error" size={'small'}
                                    disabled={!isSelected} onClick={() => onRemove(id)}>Remove</Button>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
