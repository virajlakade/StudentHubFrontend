import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import "./EditProfileForm.css";

export default function EditProfileForm({ profile, onUpdate }) {
  const { setSubView } = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    year: "",
    bio: "",
    phone: "",
    skillsInput: "",
    rollNumber: "",
    email: "",
    department: "",
    degree: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!profile) return;

    setFormData({
      name: profile.fullName || "",
      avatar: profile.profileImage || "",
      year: profile.yearOfStudy ?? "",
      bio: profile.bio || "",
      phone: profile.phone || "",
      skillsInput: profile.skills || "",
      rollNumber: profile.rollNumber || "",
      email: profile.email || "",
      department: profile.branch || "",
      degree: profile.degreeProgram || ""
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        avatar: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const err = {};

    if (!formData.name.trim()) err.name = "Full name is required";
    if (!formData.email.trim()) err.email = "Email is required";
    if (!formData.bio.trim()) err.bio = "Biography is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await onUpdate({
      fullName: formData.name,
      profileImage: formData.avatar,
      yearOfStudy: formData.year === "" ? null : Number(formData.year),
      phone: formData.phone,
      bio: formData.bio,
      skills: formData.skillsInput,
      rollNumber: formData.rollNumber,
      email: formData.email,
      branch: formData.department,
      degreeProgram: formData.degree
    });

    setSubView(null);
  };

  return (
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2 className="form-heading">Edit Student Profile</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>Full Name</label>
            <input
                name="name"
                className={errors.name ? "error" : ""}
                value={formData.name}
                onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group full-width">
            <label>Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange}/>
            {formData.avatar && (
                <img
                    src={formData.avatar}
                    alt="preview"
                    style={{width:120,height:120,borderRadius:"50%",objectFit:"cover"}}
                />
            )}
          </div>

          <div className="form-group">
            <label>Year</label>
            <select
                name="year"
                value={formData.year}
                onChange={handleChange}
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange}/>
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input name="skillsInput" value={formData.skillsInput} onChange={handleChange}/>
          </div>

          <div className="form-group full-width">
            <label>Biography</label>
            <textarea
                name="bio"
                rows="4"
                className={errors.bio ? "error" : ""}
                value={formData.bio}
                onChange={handleChange}
            />
            {errors.bio && <span className="error-text">{errors.bio}</span>}
          </div>

          <div className="form-group">
            <label>Roll Number</label>
            <input name="rollNumber" value={formData.rollNumber} onChange={handleChange}/>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
                name="email"
                className={errors.email ? "error" : ""}
                value={formData.email}
                onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Department</label>
            <input name="department" value={formData.department} onChange={handleChange}/>
          </div>

          <div className="form-group">
            <label>Degree Program</label>
            <input name="degree" value={formData.degree} onChange={handleChange}/>
          </div>

        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => setSubView(null)}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Save Profile
          </button>
        </div>
      </form>
  );
}
