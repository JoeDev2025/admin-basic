"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";

const GridItem = ({
  id,
  isPlaceholder = false,
  hidden = false,
  justDropped = false,
}: {
  id: string;
  isPlaceholder?: boolean;
  hidden?: boolean;
  justDropped?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: hidden ? 0 : 1,
  };

  return (
    <motion.div
      layout
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={clsx(
        "w-32 h-32 flex items-center justify-center rounded-md shadow-md",
        isPlaceholder
          ? "border-4 border-dashed border-gray-400 bg-transparent"
          : "bg-blue-500 text-white cursor-move",
        isDragging && "bg-blue-300"
      )}
      animate={
        isDragging
          ? { scale: 0.5 }
          : justDropped
          ? { scale: [0.8, 1.05, 1], y: [-20, 5, 0] }
          : { scale: 1, y: 0 }
      }
      transition={{ duration: 0.1 }}
    >
      {!isPlaceholder && id}
    </motion.div>
  );
};

export default function DndSortableGrid() {
  const rootSize = 8;
  const initialItems = Array.from({ length: rootSize * rootSize }, (_, i) => `${i + 1}`);
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [lastDroppedId, setLastDroppedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over?.id as string);
      setItems(arrayMove(items, oldIndex, newIndex));
      setLastDroppedId(active.id as string);
    } else {
      setLastDroppedId(null);
    }

    setActiveId(null);
    setOverId(null);
  };

  return (
    <div className="p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-8 gap-2">
            {items.map((id) => (
              <div key={id} className="relative">
                {id === overId && activeId !== overId && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <motion.div
                      layoutId="placeholder"
                      className="w-full h-full border-4 border-dashed border-gray-400 rounded-md"
                    />
                  </div>
                )}
                <GridItem
                  id={id}
                  hidden={id === activeId && activeId !== overId}
                  justDropped={id === lastDroppedId}
                />
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId && (
            <motion.div
              className="w-32 h-32 bg-blue-400 text-white flex items-center justify-center rounded-md shadow-md"
              animate={{ scale: 0.5 }}
              transition={{ duration: 0.1 }}
            >
              {activeId}
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
