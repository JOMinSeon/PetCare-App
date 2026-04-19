# VitalPaw Proactive - Database Schema Design

## 1. ERD (Entity Relationship Diagram)

```
users (1) ─────< (N) pets
users (1) ─────< (N) health_metrics
users (1) ─────< (N) diet_logs
users (1) ─────< (N) medical_history
users (1) ─────< (N) activity_logs
users (1) ─────< (N) appointments
users (1) ─────< (N) reminders
pets (1) ─────< (N) health_metrics
pets (1) ─────< (N) diet_logs
pets (1) ─────< (N) medical_history
pets (1) ─────< (N) activity_logs
```

---

## 2. Table Definitions

### 2.1 users (사용자/보호자)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | 비밀번호 해시 |
| name | VARCHAR(100) | NOT NULL | 이름 |
| phone | VARCHAR(20) | | 전화번호 |
| profile_image_url | VARCHAR(500) | | 프로필 이미지 URL |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

### 2.2 pets (반려동물)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 반려동물 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 소유주 ID |
| name | VARCHAR(100) | NOT NULL | 반려동물 이름 |
| species | ENUM('dog','cat','other') | NOT NULL | 종 |
| breed | VARCHAR(100) | | 품종 |
| birth_date | DATE | | 생년월일 |
| gender | ENUM('male','female') | | 성별 |
| weight | DECIMAL(5,2) | | 체중 (kg) |
| profile_image_url | VARCHAR(500) | | 프로필 이미지 URL |
| is_active | BOOLEAN | DEFAULT TRUE | 활성 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

### 2.3 health_metrics (건강 지표)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| pet_id | UUID | FK → pets.id, NOT NULL | 반려동물 ID |
| metric_type | ENUM('weight','activity','temperature','heart_rate') | NOT NULL | 지표 유형 |
| value | DECIMAL(10,2) | NOT NULL | 측정값 |
| unit | VARCHAR(20) | NOT NULL | 단위 (kg, step, °C, bpm) |
| recorded_at | TIMESTAMP | NOT NULL | 측정 일시 |
| notes | TEXT | | 비고 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

### 2.4 diet_logs (식단 기록)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| pet_id | UUID | FK → pets.id, NOT NULL | 반려동물 ID |
| food_name | VARCHAR(200) | NOT NULL | 사료/간식명 |
| food_type | ENUM('main','snack','supplement','medicine') | NOT NULL | 식품 유형 |
| amount | DECIMAL(10,2) | | 급여량 |
| unit | VARCHAR(20) | | 단위 (g, 개, ml) |
| calories | INT | | 칼로리 (kcal) |
| fed_at | TIMESTAMP | NOT NULL | 급여 일시 |
| notes | TEXT | | 비고 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

### 2.5 medical_history (병력/검진 기록)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| pet_id | UUID | FK → pets.id, NOT NULL | 반려동물 ID |
| record_type | ENUM('checkup','vaccination','surgery','illness','medication','other') | NOT NULL | 기록 유형 |
| title | VARCHAR(200) | NOT NULL | 제목 |
| description | TEXT | | 상세 설명 |
| hospital_name | VARCHAR(200) | | 병원명 |
| veterinarian | VARCHAR(100) | | 수의사명 |
| cost | DECIMAL(10,2) | | 비용 |
| record_date | DATE | NOT NULL | 기록일 |
| next_date | DATE | | 다음 예약일 |
| documents | JSON | | 관련 문서 URL 배열 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

### 2.6 activity_logs (활동 기록)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| pet_id | UUID | FK → pets.id, NOT NULL | 반려동물 ID |
| activity_type | ENUM('walk','play','training','grooming','other') | NOT NULL | 활동 유형 |
| title | VARCHAR(200) | NOT NULL | 제목 |
| duration | INT | | 소요 시간 (분) |
| intensity | ENUM('low','medium','high') | | 강도 |
| calories_burned | INT | | 소모 칼로리 |
| location | VARCHAR(200) | | 장소 |
| occurred_at | TIMESTAMP | NOT NULL | 활동 일시 |
| notes | TEXT | | 비고 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

### 2.7 reminders (알림/리마인더)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| pet_id | UUID | FK → pets.id | 반려동물 ID |
| reminder_type | ENUM('medication','vaccination','checkup','diet','exercise','custom') | NOT NULL | 알림 유형 |
| title | VARCHAR(200) | NOT NULL | 제목 |
| message | TEXT | | 메시지 |
| scheduled_at | TIMESTAMP | NOT NULL | 예약 일시 |
| repeat_type | ENUM('once','daily','weekly','monthly','yearly') | DEFAULT 'once' | 반복 유형 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성화 여부 |
| is_completed | BOOLEAN | DEFAULT FALSE | 완료 여부 |
| completed_at | TIMESTAMP | | 완료 일시 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

### 2.8 appointments (병원 예약)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| pet_id | UUID | FK → pets.id, NOT NULL | 반려동물 ID |
| hospital_name | VARCHAR(200) | NOT NULL | 병원명 |
| department | VARCHAR(100) | | 진료과 |
| veterinarian | VARCHAR(100) | | 수의사명 |
| appointment_type | ENUM('checkup','vaccination','surgery','consultation','emergency','other') | NOT NULL | 예약 유형 |
| reason | TEXT | | 예약 사유 |
| appointment_date | TIMESTAMP | NOT NULL | 예약 일시 |
| status | ENUM('pending','confirmed','completed','cancelled') | DEFAULT 'pending' | 상태 |
| notes | TEXT | | 비고 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

### 2.9 health_alerts (건강 알림)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| pet_id | UUID | FK → pets.id, NOT NULL | 반려동물 ID |
| alert_type | ENUM('weight_change','activity_drop','missed_medication','vaccination_due','checkup_due','abnormal_reading') | NOT NULL | 알림 유형 |
| severity | ENUM('info','warning','critical') | NOT NULL | 심각도 |
| title | VARCHAR(200) | NOT NULL | 제목 |
| message | TEXT | | 메시지 |
| metric_value | DECIMAL(10,2) | | 관련 지표값 |
| threshold_value | DECIMAL(10,2) | | 임계값 |
| is_read | BOOLEAN | DEFAULT FALSE | 확인 여부 |
| is_resolved | BOOLEAN | DEFAULT FALSE | 해결 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| resolved_at | TIMESTAMP | | 해결 일시 |

### 2.10 community_posts (커뮤니티 게시글)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 작성자 ID |
| category | ENUM('question','share','advice','notice') | NOT NULL | 카테고리 |
| title | VARCHAR(200) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| image_urls | JSON | | 이미지 URL 배열 |
| view_count | INT | DEFAULT 0 | 조회수 |
| like_count | INT | DEFAULT 0 | 좋아요 수 |
| comment_count | INT | DEFAULT 0 | 댓글 수 |
| is_pinned | BOOLEAN | DEFAULT FALSE | 상단 고정 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

### 2.11 comments (댓글)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 고유 ID |
| post_id | UUID | FK → community_posts.id, NOT NULL | 게시글 ID |
| user_id | UUID | FK → users.id, NOT NULL | 작성자 ID |
| content | TEXT | NOT NULL | 내용 |
| parent_id | UUID | FK → comments.id | 부모 댓글 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

---

## 3. Indexes

```sql
-- users
CREATE INDEX idx_users_email ON users(email);

-- pets
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_pets_is_active ON pets(is_active);

-- health_metrics
CREATE INDEX idx_health_metrics_pet_id ON health_metrics(pet_id);
CREATE INDEX idx_health_metrics_type_date ON health_metrics(metric_type, recorded_at);
CREATE INDEX idx_health_metrics_recorded_at ON health_metrics(recorded_at);

-- diet_logs
CREATE INDEX idx_diet_logs_pet_id ON diet_logs(pet_id);
CREATE INDEX idx_diet_logs_fed_at ON diet_logs(fed_at);

-- medical_history
CREATE INDEX idx_medical_history_pet_id ON medical_history(pet_id);
CREATE INDEX idx_medical_history_record_date ON medical_history(record_date);

-- activity_logs
CREATE INDEX idx_activity_logs_pet_id ON activity_logs(pet_id);
CREATE INDEX idx_activity_logs_occurred_at ON activity_logs(occurred_at);

-- reminders
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_scheduled_at ON reminders(scheduled_at);
CREATE INDEX idx_reminders_is_active ON reminders(is_active);

-- appointments
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- health_alerts
CREATE INDEX idx_health_alerts_pet_id ON health_alerts(pet_id);
CREATE INDEX idx_health_alerts_is_read ON health_alerts(is_read);
CREATE INDEX idx_health_alerts_created_at ON health_alerts(created_at);

-- community_posts
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);

-- comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

---

## 4. Relationships Summary

| Parent Table | Child Table | Relationship |
|--------------|-------------|---------------|
| users | pets | 1:N |
| users | reminders | 1:N |
| users | appointments | 1:N |
| users | community_posts | 1:N |
| pets | health_metrics | 1:N |
| pets | diet_logs | 1:N |
| pets | medical_history | 1:N |
| pets | activity_logs | 1:N |
| pets | health_alerts | 1:N |
| community_posts | comments | 1:N |
| comments | comments (self) | 1:N (parent_id) |

---

## 5. Migration Strategy

1. **Phase 1**: users, pets (기본 정보)
2. **Phase 2**: health_metrics, diet_logs, activity_logs (일상 기록)
3. **Phase 3**: medical_history, health_alerts (건강/알림)
4. **Phase 4**: reminders, appointments (예약/알림)
5. **Phase 5**: community_posts, comments (커뮤니티)
