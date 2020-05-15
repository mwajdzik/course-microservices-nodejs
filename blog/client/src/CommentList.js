import React from 'react';

export default ({comments}) => {

    const renderedComments = comments.map(comment => {
        let content;

        if (comment.status === 'APPROVED') {
            content = comment.content;
        } else if (comment.status === 'REJECTED') {
            content = 'This comment has been rejected';
        } else if (comment.status === 'PENDING') {
            content = 'Ths comment is awaiting moderation';
        }

        return <li key={comment.id}>{content}</li>;
    });

    return <ul>{renderedComments}</ul>;
};
