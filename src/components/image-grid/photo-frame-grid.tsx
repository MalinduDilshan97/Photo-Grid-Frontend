import {forwardRef, HTMLAttributes, memo, useCallback, useEffect, useRef, useState} from "react";
import {Photo, PhotoAlbum, PhotoProps} from "react-photo-album";
import clsx from "clsx";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable} from "@dnd-kit/sortable";
import "../grid.css";
import {GridImage} from "../../services/photo-helper";

// @dnd-kit requires string 'id' on sortable elements
interface SortablePhoto extends Photo {
    id: string;
}

type SortablePhotoProps = PhotoProps<SortablePhoto>;

type PhotoFrameProps = SortablePhotoProps & {
    overlay?: boolean;
    active?: boolean;
    insertPosition?: "before" | "after";
    attributes?: Partial<HTMLAttributes<HTMLDivElement>>;
    listeners?: Partial<HTMLAttributes<HTMLDivElement>>;
};

interface PhotoFrameGridProps {
    selectedPhotos: GridImage[]
}

const PhotoFrame = memo(
    forwardRef<HTMLDivElement, PhotoFrameProps>((props, ref) => {
        const {layoutOptions, imageProps, overlay, active, insertPosition, attributes, listeners} = props;
        const {alt, style, ...restImageProps} = imageProps;

        return (
            <div
                ref={ref}
                style={{
                    width: overlay ? `calc(100% - ${2 * layoutOptions.padding}px)` : style.width,
                    padding: style.padding,
                    marginBottom: style.marginBottom,
                }}
                className={clsx("photo-frame", {
                    overlay: overlay,
                    active: active,
                    insertBefore: insertPosition === "before",
                    insertAfter: insertPosition === "after",
                })}
                {...attributes}
                {...listeners}
            >
                <img
                    alt={alt}
                    style={{
                        ...style,
                        width: "100%",
                        height: "auto",
                        padding: 0,
                        marginBottom: 0,
                    }}
                    {...restImageProps}
                />
            </div>
        );
    })
);
PhotoFrame.displayName = "PhotoFrame";

const SortablePhotoFrame = (props: SortablePhotoProps & { activeIndex?: number }) => {
    const {photo, activeIndex} = props;
    const {attributes, listeners, isDragging, index, over, setNodeRef} = useSortable({id: photo.id});

    return (
        <PhotoFrame
            ref={setNodeRef}
            active={isDragging}
            insertPosition={
                activeIndex !== undefined && over?.id === photo.id && !isDragging
                    ? index > activeIndex
                        ? "after"
                        : "before"
                    : undefined
            }
            aria-label="sortable image"
            attributes={attributes}
            listeners={listeners}
            {...props}
        />
    );
};

const PhotoFrameGrid = (props: PhotoFrameGridProps) => {
    const {selectedPhotos} = props

    const [photos, setPhotos] = useState(
        (selectedPhotos as GridImage[]).map((photo) => ({
            ...photo,
            id: photo.key || photo.src,
        }))
    );

    useEffect(() => {
        setPhotos((selectedPhotos as GridImage[]).map((photo) => ({
            ...photo,
            id: photo.key || photo.src,
        })))
    }, [selectedPhotos])

    const renderedPhotos = useRef<{ [key: string]: SortablePhotoProps }>({});
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const activeIndex = activeId ? photos.findIndex((photo) => photo.id === activeId) : undefined;

    const sensors = useSensors(
        useSensor(MouseSensor, {activationConstraint: {distance: 5}}),
        useSensor(TouchSensor, {activationConstraint: {delay: 50, tolerance: 10}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    const handleDragStart = useCallback(({active}: DragStartEvent) => setActiveId(active.id), []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

    const renderPhoto = useCallback(
        (props: SortablePhotoProps) => {
            // capture rendered photos for future use in DragOverlay
            renderedPhotos.current[props.photo.id] = props;
            return <SortablePhotoFrame activeIndex={activeIndex} {...props} />;
        },
        [activeIndex]
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={photos}>
                <PhotoAlbum photos={photos} layout="masonry" spacing={20} padding={15} renderPhoto={renderPhoto}/>
            </SortableContext>
            <DragOverlay>{activeId && <PhotoFrame overlay {...renderedPhotos.current[activeId]} />}</DragOverlay>
        </DndContext>
    );
};

export default PhotoFrameGrid;
