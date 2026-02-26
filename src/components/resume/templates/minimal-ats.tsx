import { ResumeData, ResumeConfig } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface Props {
    data: ResumeData;
    config: ResumeConfig;
    scale?: number;
}

export function MinimalATSTemplate({ data, config, scale = 1 }: Props) {
    const { personalInfo: p, experience, education, skills, projects, certifications, sections } = data;
    const accent = config.accentColor || "#1e40af";

    return (
        <div
            className="bg-white text-gray-900"
            style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                fontFamily: config.fontFamily || "Arial, sans-serif",
                fontSize: config.fontSize === "sm" ? 11 : config.fontSize === "lg" ? 14 : 12,
                padding: "48px 56px",
            }}
        >
            {/* Header — plain text for ATS */}
            <div className="border-b-2 pb-4 mb-5" style={{ borderColor: accent }}>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{p.fullName || "Your Name"}</h1>
                <div className="text-xs text-gray-600 flex flex-wrap gap-3">
                    {p.email && <span>{p.email}</span>}
                    {p.phone && <span>|  {p.phone}</span>}
                    {p.location && <span>|  {p.location}</span>}
                    {p.linkedin && <span>|  {p.linkedin}</span>}
                    {p.github && <span>|  {p.github}</span>}
                </div>
            </div>

            {/* Summary */}
            {sections.showSummary && p.summary && (
                <Section title="PROFESSIONAL SUMMARY" accent={accent}>
                    <p className="text-xs text-gray-700 leading-relaxed">{p.summary}</p>
                </Section>
            )}

            {/* Experience */}
            {sections.showExperience && experience.length > 0 && (
                <Section title="WORK EXPERIENCE" accent={accent}>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between">
                                <span className="font-bold text-sm">{exp.position}</span>
                                <span className="text-xs text-gray-500">
                                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {exp.description.map((b, i) => (
                                    <li key={i} className="text-xs text-gray-700">{b}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Section>
            )}

            {/* Education */}
            {sections.showEducation && education.length > 0 && (
                <Section title="EDUCATION" accent={accent}>
                    {education.map((edu) => (
                        <div key={edu.id} className="mb-3">
                            <div className="flex justify-between">
                                <span className="font-bold text-sm">{edu.institution}</span>
                                <span className="text-xs text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                            </div>
                            <p className="text-xs text-gray-600">{edu.degree} in {edu.field}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</p>
                        </div>
                    ))}
                </Section>
            )}

            {/* Skills */}
            {sections.showSkills && skills.length > 0 && (
                <Section title="SKILLS" accent={accent}>
                    {skills.map((group) => (
                        <div key={group.id} className="mb-1 flex gap-2">
                            <span className="text-xs font-semibold text-gray-700 w-28 flex-shrink-0">{group.category}:</span>
                            <span className="text-xs text-gray-600">{group.items.join(", ")}</span>
                        </div>
                    ))}
                </Section>
            )}

            {/* Projects */}
            {sections.showProjects && projects.length > 0 && (
                <Section title="PROJECTS" accent={accent}>
                    {projects.map((proj) => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex justify-between">
                                <span className="font-bold text-sm">{proj.name}</span>
                                {proj.url && <span className="text-xs text-gray-500">{proj.url}</span>}
                            </div>
                            <p className="text-xs text-gray-700">{proj.description}</p>
                            <p className="text-xs text-gray-500">Technologies: {proj.technologies.join(", ")}</p>
                        </div>
                    ))}
                </Section>
            )}

            {/* Certifications */}
            {sections.showCertifications && certifications.length > 0 && (
                <Section title="CERTIFICATIONS" accent={accent}>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="mb-1 flex justify-between">
                            <span className="text-xs font-semibold">{cert.name} — {cert.issuer}</span>
                            <span className="text-xs text-gray-500">{formatDate(cert.date)}</span>
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <h2 className="text-xs font-bold tracking-widest mb-2 pb-0.5 border-b" style={{ color: accent, borderColor: accent }}>
                {title}
            </h2>
            {children}
        </div>
    );
}
