# routes/video_routes.py

from flask import Blueprint, request, jsonify, send_from_directory, send_file
from io import BytesIO
from werkzeug.utils import secure_filename
from datetime import date, datetime
from models import db, Video
from auth import token_required
import os

video_bp = Blueprint('video_bp', __name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@video_bp.route('/upload', methods=['POST'])
@token_required
def upload_video(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_data = file.read()
    if not file_data:
        return jsonify({'error': 'Uploaded file is empty or unreadable'}), 400

    filename = secure_filename(file.filename)

    video = Video(
        filename=filename,
        video_data=file_data,
        user_id=current_user.id,
        upload_date=date.today()
    )
    db.session.add(video)
    db.session.commit()

    return jsonify({'message': 'Video uploaded successfully', 'video_id': video.id})

@video_bp.route('/download/<int:video_id>', methods=['GET'])
@token_required
def download_video(current_user, video_id):
    video = Video.query.filter_by(id=video_id, user_id=current_user.id).first()
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    return send_file(
        BytesIO(video.video_data),
        download_name=video.filename,
        mimetype='video/mp4'
    )

@video_bp.route('/videos', methods=['GET'])
@token_required
def get_videos_by_date(current_user):
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'Missing date param'}), 400

    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    videos = Video.query.filter_by(user_id=current_user.id, upload_date=query_date).all()

    return jsonify([
        {
            'id': v.id,
            'upload_date': v.upload_date.strftime("%Y-%m-%d"),
            'filename': v.filename
        }
        for v in videos
    ])

@video_bp.route('/delete/<int:video_id>', methods=['DELETE'])
@token_required
def delete_video(current_user, video_id):
    video = Video.query.filter_by(id=video_id, user_id=current_user.id).first()
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    db.session.delete(video)
    db.session.commit()

    return jsonify({'message': f'Video {video_id} deleted successfully'})
