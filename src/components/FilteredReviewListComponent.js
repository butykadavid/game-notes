import { useState, useMemo } from "react";
import { getOvrRating } from "../../public/functions";
import ReviewFilter from "./ReviewFilterComponent";
import ReviewCard from "./ReviewCardComponent";

export default function FilteredReviewList({ 
    reviews, 
    reviewCardProps = {},
    emptyMessage = null,
    keyGenerator = null
}) {
    const [ordering, setOrdering] = useState("created");
    const [direction, setDirection] = useState("DESC");

    const sortedItems = useMemo(() => {
        const sorted = [...reviews];

        sorted.sort((a, b) => {
            const aVal = ordering === "overall" ? getOvrRating(a) : a[ordering];
            const bVal = ordering === "overall" ? getOvrRating(b) : b[ordering];
            return direction === "ASC" ? aVal - bVal : bVal - aVal;
        });

        return sorted;
    }, [reviews, ordering, direction]);

    const getKey = (review, index) => {
        if (keyGenerator) {
            return keyGenerator(review, index);
        }
        // Default key generation
        return review.userName && review.created 
            ? `${review.userName}-${review.created}` 
            : `review-${index}`;
    };

    return (
        <>
            <ReviewFilter
                ordering={ordering}
                setOrdering={setOrdering}
                direction={direction}
                setDirection={setDirection}
            />

            {sortedItems.length !== 0 ? (
                sortedItems.map((review, index) => (
                    <ReviewCard
                        key={getKey(review, index)}
                        review={review}
                        {...reviewCardProps}
                    />
                ))
            ) : (
                emptyMessage
            )}
        </>
    );
}

