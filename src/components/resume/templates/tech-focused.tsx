import { ResumeData, ResumeConfig } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface Props {
    data: ResumeData;
    config: ResumeConfig;
    scale?: number;
}

export function TechFocusedTemplate({ data, config, scale = 1 }: Props) {
    const { personalInfo: p, experience, education, skills, projects, certifications, sections } = data;
    const accent = config.accentColor || "#10b981";

    return (
        <div
            className="bg-gray-950 text-gray-100"
            style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: config.fontSize === "sm" ? 11 : config.fontSize === "lg" ? 14 : 12,
            }}
        >
            {/* Terminal-style header */}
            <div className="px-8 py-6 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-500">resume.json</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">{"{"}</div>
                <div className="pl-4">
                    <div className="text-xs"><span style={{ color: accent }}>"name"</span>: <span className="text-yellow-300">"{p.fullName || "Your Name"}"</span>,</div>
                    {p.email && <div className="text-xs"><span style={{ color: accent }}>"email"</span>: <span className="text-yellow-300">"{p.email}"</span>,</div>}
                    {p.phone && <div className="text-xs"><span style={{ color: accent }}>"phone"</span>: <span className="text-yellow-300">"{p.phone}"</span>,</div>}
                    {p.location && <div className="text-xs"><span style={{ color: accent }}>"location"</span>: <span className="text-yellow-300">"{p.location}"</span>,</div>}
                    {p.github && <div className="text-xs"><span style={{ color: accent }}>"github"</span>: <span className="text-blue-400">"{p.github}"</span>,</div>}
                    {p.linkedin && <div className="text-xs"><span style={{ color: accent }}>"linkedin"</span>: <span className="text-blue-400">"{p.linkedin}"</span></div>}
                </div>
                <div className="text-xs text-gray-500">{"}"}</div>
            </div>

            <div className="px-8 py-6 space-y-6">
                {/* Summary */}
                {sections.showSummary && p.summary && (
                    <div>
                        <div className="text-xs font-bold mb-2" style={{ color: accent }}>// SUMMARY</div>
                        <p className="text-xs text-gray-300 leading-relaxed border-l-2 pl-3" style={{ borderColor: accent }}>{p.summary}</p>
                    </div>
                )}

                {/* Skills — grid */}
                {sections.showSkills && skills.length > 0 && (
                    <div>
                        <div className="text-xs font-bold mb-3" style={{ color: accent }}>// TECH STACK</div>
                        <div className="grid grid-cols-2 gap-3">
                            {skills.map((group) => (
                                <div key={group.id} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{group.category}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {group.items.map((skill) => (
                                            <span key={skill} className="text-xs px-1.5 py-0.5 rounded text-gray-300" style={{ backgroundColor: `${accent}22`, border: `1px solid ${accent}44` }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {sections.showExperience && experience.length > 0 && (
                    <div>
                        <div className="text-xs font-bold mb-3" style={{ color: accent }}>// EXPERIENCE</div>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4 bg-gray-900 rounded-lg p-4 border border-gray-800">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <span className="text-sm font-bold text-white">{exp.position}</span>
                                        <span className="text-xs text-gray-400 ml-2">@ {exp.company}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        {formatDate(exp.startDate)} → {exp.current ? "now" : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                <ul className="space-y-1 mt-2">
                                    {exp.description.map((b, i) => (
                                        <li key={i} className="text-xs text-gray-300 flex gap-2">
                                            <span style={{ color: accent }}>$</span>{b}
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
                        <div className="text-xs font-bold mb-3" style={{ color: accent }}>// PROJECTS</div>
                        <div className="grid grid-cols-2 gap-3">
                            {projects.map((proj) => (
                                <div key={proj.id} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                                    <p className="text-xs font-bold text-white mb-1">{proj.name}</p>
                                    <p className="text-xs text-gray-400 mb-2">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {proj.technologies.map((t) => (
                                            <span key={t} className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {sections.showEducation && education.length > 0 && (
                    <div>
                        <div className="text-xs font-bold mb-2" style={{ color: accent }}>// EDUCATION</div>
                        {education.map((edu) => (
                            <div key={edu.id} className="flex justify-between text-xs mb-1">
                                <span className="text-gray-300">{edu.institution} — {edu.degree} in {edu.field}</span>
                                <span className="text-gray-500">{formatDate(edu.endDate)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
