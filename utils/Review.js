import { Appearance } from 'react-native-appearance';
import { db, auth, timestamp } from '../lib/Fire';
import { getUserProfileData } from './User';
import { avatarDefault, avatarDark } from '../constants/Images';

const scheme = Appearance.getColorScheme();

export async function buildReviewArray(t, data) {
    const reviews = [];

    for (const review of data) {
        const userData = await getUserProfileData(t, review.uid);

        if (!userData.photoURL) {
            userData.photoURL = avatarDefault;

            if (scheme === 'dark') {
                userData.photoURL = avatarDark;
            }
        }

        review.user = {
            uid: review.uid,
            name: userData.name,
            location: userData.location,
            photoURL: userData.photoURL,
        };

        reviews[review.id] = review;
        reviews.push(review);
    }

    if (data.length === 0) {
        return [];
    }

    return reviews;
}

export async function updateReview(reviewData) {
    const { rid, rating, review } = reviewData;
    await db
        .collection('reviews')
        .doc(rid)
        .set({ rating, review }, { merge: true });
}

export function deleteReview(reviewData) {
    const { rid } = reviewData;
    db.collection('reviews').doc(rid).delete();
}

export async function getReviewData(rid) {
    let reviewData = await db.collection('reviews').doc(rid).get();

    reviewData = reviewData.data();
    reviewData.id = rid;

    return reviewData;
}

export async function writeReview(reviewData) {
    const user = auth.currentUser;

    reviewData.uid = user.uid;
    reviewData.userLikes = [];
    reviewData.savedOn = timestamp;

    return db
        .collection('reviews')
        .add(reviewData)
        .then(async function (docRef) {
            const review = await getReviewData(docRef.id);
            return review;
        });
}

export function getReviewRef(hid, sortDirection, querySize) {
    return db
        .collection('reviews')
        .where('hid', '==', hid)
        .orderBy('savedOn', sortDirection)
        .limit(querySize);
}

export async function getRecentReviews(t, hid, sortDirection, querySize) {
    const reviewRef = getReviewRef(hid, sortDirection, querySize);
    const querySnapshot = await reviewRef.get();

    let recentReviews = [];

    await querySnapshot.forEach((review) => {
        if (review.exists) {
            const reviewData = review.data() || {};
            reviewData.id = review.id;

            const reduced = {
                key: review.id,
                ...reviewData,
            };

            recentReviews.push(reduced);
        }
    });

    recentReviews = await buildReviewArray(t, recentReviews);
    return recentReviews;
}

export function writeReviewLikes(rid, userLikes) {
    db.collection('reviews').doc(rid).set({ userLikes }, { merge: true });
}

export function removeReviewFromList(reviews, selectedReview) {
    const deletedReview = reviews.find(
        (review) => review.id === selectedReview,
    );

    if (deletedReview) {
        const index = reviews.indexOf(deletedReview);
        reviews.splice(index, 1);
    }

    return reviews;
}

export function removeReviewFromArray(reviews, hid) {
    const index = reviews.indexOf(hid);
    reviews.splice(index, 1);

    return reviews;
}

export function addReviewToArray(reviews, hid) {
    if (!reviews.includes(hid)) {
        reviews.push(hid);
    }

    return reviews;
}
