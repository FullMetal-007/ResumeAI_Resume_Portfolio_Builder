import { ResumeData, ResumeConfig } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface Props {
    data: ResumeData;
    config: ResumeConfig;
    scale?: number;
}

export function ExecutiveTemplate({ data, config, scale = 1 }: Props) {
    const { personalInfo: p, experience, education, skills, projects, certifications, sections } = data;
    const accent = config.accentColor || "#1e3a5f";

    return (
        <div
            className="bg-white text-gray-900"
            style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                fontFamily: config.fontFamily || "Georgia, serif",
                fontSize: config.fontSize === "sm" ? 12 : config.fontSize === "lg" ? 15 : 13,
                padding: "56px 64px",
            }}
        >
            {/* Header */}
            <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: accent }}>
                <h1 className="text-4xl font-bold tracking-wide mb-2" style={{ color: accent }}>
                    {p.fullName || "Your Name"}
                </h1>
                <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-500 mt-2">
                    {p.email && <span>{p.email}</span>}
                    {p.phone && <span>·  {p.phone}</span>}
                    {p.location && <span>·  {p.location}</span>}
                    {p.linkedin && <span>·  {p.linkedin}</span>}
                </div>
            </div>

            {/* Summary */}
            {sections.showSummary && p.summary && (
                <div className="mb-6">
                    <p className="text-sm text-gray-700 leading-relaxed text-center italic">{p.summary}</p>
                </div>
            )}

            {/* Experience */}
            {sections.showExperience && experience.length > 0 && (
                <ExecSection title="Professional Experience" accent={accent}>
                    {experience.map((exp) => (
                        <div key={exp.id} className="mb-5">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <span className="text-sm font-bold" style={{ color: accent }}>{exp.position}</span>
                                <span className="text-xs text-gray-400 italic">
                                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-600 mb-1.5">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                            <ul className="space-y-1">
                                {exp.description.map((b, i) => (
                                    <li key={i} className="text-xs text-gray-700 flex gap-2">
                                        <span style={{ color: accent }} className="flex-shrink-0">■</span>{b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </ExecSection>
            )}

            <div className="grid grid-cols-2 gap-8">
                {/* Education */}
                {sections.showEducation && education.length > 0 && (
                    <ExecSection title="Education" accent={accent}>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <p className="text-sm font-bold" style={{ color: accent }}>{edu.institution}</p>
                                <p className="text-xs text-gray-700">{edu.degree} in {edu.field}</p>
                                <p className="text-xs text-gray-400 italic">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
                            </div>
                        ))}
                    </ExecSection>
                )}

                {/* Skills */}
                {sections.showSkills && skills.length > 0 && (
                    <ExecSection title="Core Competencies" accent={accent}>
                        {skills.map((group) => (
                            <div key={group.id} className="mb-2">
                                <p className="text-xs font-bold text-gray-600">{group.category}</p>
                                <p className="text-xs text-gray-500">{group.items.join(" · ")}</p>
                            </div>
                        ))}
                    </ExecSection>
                )}
            </div>

            {/* Projects */}
            {sections.showProjects && projects.length > 0 && (
                <ExecSection title="Key Projects" accent={accent}>
                    {projects.map((proj) => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex justify-between">
                                <span className="text-sm font-bold" style={{ color: accent }}>{proj.name}</span>
                                {proj.url && <span className="text-xs text-gray-400 italic">{proj.url}</span>}
                            </div>
                            <p className="text-xs text-gray-700">{proj.description}</p>
                            <p className="text-xs text-gray-400">{proj.technologies.join(", ")}</p>
                        </div>
                    ))}
                </ExecSection>
            )}

            {/* Certifications */}
            {sections.showCertifications && certifications.length > 0 && (
                <ExecSection title="Certifications" accent={accent}>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-gray-800">{cert.name} — {cert.issuer}</span>
                            <span className="text-gray-400 italic">{formatDate(cert.date)}</span>
                        </div>
                    ))}
                </ExecSection>
            )}
        </div>
    );
}

function ExecSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: accent }}>{title}</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: accent, opacity: 0.3 }} />
            </div>
            {children}
        </div>
    );
}
