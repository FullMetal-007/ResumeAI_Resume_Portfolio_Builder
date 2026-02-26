import { ResumeData, ResumeConfig } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface Props {
    data: ResumeData;
    config: ResumeConfig;
    scale?: number;
}

export function ModernProfessionalTemplate({ data, config, scale = 1 }: Props) {
    const { personalInfo: p, experience, education, skills, projects, certifications, sections } = data;
    const accent = config.accentColor || "#6366f1";

    return (
        <div
            className="bg-white text-gray-900 font-sans"
            style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                fontFamily: config.fontFamily || "Inter",
                fontSize: config.fontSize === "sm" ? 12 : config.fontSize === "lg" ? 15 : 13,
            }}
        >
            {/* Header */}
            <div style={{ backgroundColor: accent }} className="px-10 py-8 text-white">
                <h1 className="text-3xl font-bold tracking-tight">{p.fullName || "Your Name"}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm opacity-90">
                    {p.email && <span>{p.email}</span>}
                    {p.phone && <span>• {p.phone}</span>}
                    {p.location && <span>• {p.location}</span>}
                    {p.linkedin && <span>• {p.linkedin}</span>}
                    {p.github && <span>• {p.github}</span>}
                    {p.website && <span>• {p.website}</span>}
                </div>
            </div>

            <div className="flex">
                {/* Left column */}
                <div className="w-64 flex-shrink-0 bg-gray-50 px-6 py-6 space-y-6">
                    {/* Skills */}
                    {sections.showSkills && skills.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                                Skills
                            </h2>
                            {skills.map((group) => (
                                <div key={group.id} className="mb-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">{group.category}</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">{group.items.join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education */}
                    {sections.showEducation && education.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                                Education
                            </h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <p className="text-xs font-semibold text-gray-800">{edu.institution}</p>
                                    <p className="text-xs text-gray-600">{edu.degree} in {edu.field}</p>
                                    <p className="text-xs text-gray-400">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Certifications */}
                    {sections.showCertifications && certifications.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                                Certifications
                            </h2>
                            {certifications.map((cert) => (
                                <div key={cert.id} className="mb-2">
                                    <p className="text-xs font-semibold text-gray-800">{cert.name}</p>
                                    <p className="text-xs text-gray-500">{cert.issuer} · {formatDate(cert.date)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="flex-1 px-8 py-6 space-y-6">
                    {/* Summary */}
                    {sections.showSummary && p.summary && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
                                Professional Summary
                            </h2>
                            <p className="text-xs text-gray-700 leading-relaxed">{p.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {sections.showExperience && experience.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                                Experience
                            </h2>
                            {experience.map((exp) => (
                                <div key={exp.id} className="mb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{exp.position}</p>
                                            <p className="text-xs font-medium text-gray-600">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                            {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                                        </p>
                                    </div>
                                    <ul className="mt-1.5 space-y-1">
                                        {exp.description.map((bullet, i) => (
                                            <li key={i} className="text-xs text-gray-700 flex gap-2">
                                                <span style={{ color: accent }} className="mt-0.5 flex-shrink-0">▸</span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {sections.showProjects && projects.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                                Projects
                            </h2>
                            {projects.map((proj) => (
                                <div key={proj.id} className="mb-3">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                                        {proj.url && <a href={proj.url} className="text-xs underline" style={{ color: accent }}>{proj.url}</a>}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{proj.technologies.join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
